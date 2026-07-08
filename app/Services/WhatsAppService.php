<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Thin client for the Meta WhatsApp Cloud API.
 *
 * Business-initiated messages must use a pre-approved template
 * (created in the Meta Business console). The template referenced by
 * services.whatsapp.template receives the body parameters passed to
 * sendTemplate() in order.
 */
class WhatsAppService
{
    public function isConfigured(): bool
    {
        return (bool) (config('services.whatsapp.token') && config('services.whatsapp.phone_number_id'));
    }

    /**
     * Send a template message.
     *
     * @return array{id: ?string, error: ?string} WhatsApp message id on
     *         success (used to correlate webhook delivery statuses), or an
     *         error string on failure.
     */
    public function sendTemplate(string $phone, array $bodyParams): array
    {
        $to = $this->normalizePhone($phone);

        if (! $to) {
            return ['id' => null, 'error' => 'invalid_phone'];
        }

        $response = Http::withToken(config('services.whatsapp.token'))
            ->post('https://graph.facebook.com/v21.0/' . config('services.whatsapp.phone_number_id') . '/messages', [
                'messaging_product' => 'whatsapp',
                'to' => $to,
                'type' => 'template',
                'template' => [
                    'name' => config('services.whatsapp.template'),
                    'language' => ['code' => config('services.whatsapp.template_locale')],
                    'components' => [
                        [
                            'type' => 'body',
                            'parameters' => array_map(
                                fn ($param) => ['type' => 'text', 'text' => $param],
                                $bodyParams,
                            ),
                        ],
                    ],
                ],
            ]);

        if ($response->successful()) {
            return ['id' => $response->json('messages.0.id'), 'error' => null];
        }

        $error = $response->json('error.message') ?? ('HTTP ' . $response->status());
        Log::warning('WhatsApp send failed', ['to' => $to, 'error' => $error]);

        return ['id' => null, 'error' => $error];
    }

    /**
     * Normalize to international format without "+" (e.g. 2376XXXXXXXX).
     * Local numbers get the configured default country code prefixed.
     */
    public function normalizePhone(string $phone): ?string
    {
        $digits = preg_replace('/\D/', '', $phone);

        if (strlen($digits) < 8) {
            return null;
        }

        $countryCode = config('services.whatsapp.default_country_code');

        if (! str_starts_with($digits, $countryCode)) {
            $digits = $countryCode . ltrim($digits, '0');
        }

        return $digits;
    }
}
