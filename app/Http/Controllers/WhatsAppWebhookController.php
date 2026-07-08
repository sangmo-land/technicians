<?php

namespace App\Http\Controllers;

use App\Models\WorkPostNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class WhatsAppWebhookController extends Controller
{
    /**
     * Meta's one-time verification handshake (GET).
     *
     * Meta sends hub.mode, hub.verify_token and hub.challenge; we must echo
     * the challenge back if the token matches WHATSAPP_WEBHOOK_VERIFY_TOKEN.
     * (PHP normalizes the dotted query keys to underscores.)
     */
    public function verify(Request $request)
    {
        $verifyToken = config('services.whatsapp.webhook_verify_token');

        if (
            $verifyToken
            && $request->query('hub_mode') === 'subscribe'
            && hash_equals($verifyToken, (string) $request->query('hub_verify_token'))
        ) {
            return response($request->query('hub_challenge'), 200);
        }

        abort(403);
    }

    /**
     * Event notifications (POST): delivery statuses for sent messages.
     */
    public function handle(Request $request)
    {
        if (! $this->hasValidSignature($request)) {
            abort(403);
        }

        foreach ($request->input('entry', []) as $entry) {
            foreach ($entry['changes'] ?? [] as $change) {
                foreach ($change['value']['statuses'] ?? [] as $status) {
                    $this->applyStatus($status);
                }
            }
        }

        // Always acknowledge quickly so Meta doesn't retry or disable the webhook.
        return response()->json(['status' => 'ok']);
    }

    private function applyStatus(array $status): void
    {
        $messageId = $status['id'] ?? null;
        $state = $status['status'] ?? null;

        if (! $messageId || ! in_array($state, ['delivered', 'read', 'failed'], true)) {
            return;
        }

        $notification = WorkPostNotification::where('wa_message_id', $messageId)->first();

        if (! $notification) {
            return;
        }

        // Never downgrade: read > delivered > sent.
        if ($state === 'delivered' && $notification->status === 'read') {
            return;
        }

        $error = null;
        if ($state === 'failed') {
            $firstError = $status['errors'][0] ?? [];
            $error = Str::limit(trim(($firstError['code'] ?? '') . ' ' . ($firstError['title'] ?? 'delivery_failed')), 250);
        }

        $notification->update(['status' => $state, 'error' => $error]);
    }

    /**
     * Verify the X-Hub-Signature-256 header (HMAC of the raw body using the
     * Meta app secret). If no app secret is configured, accept but log once.
     */
    private function hasValidSignature(Request $request): bool
    {
        $secret = config('services.whatsapp.app_secret');

        if (! $secret) {
            Log::info('WhatsApp webhook received without WHATSAPP_APP_SECRET configured; skipping signature check.');

            return true;
        }

        $signature = $request->header('X-Hub-Signature-256', '');
        $expected = 'sha256=' . hash_hmac('sha256', $request->getContent(), $secret);

        return hash_equals($expected, $signature);
    }
}
