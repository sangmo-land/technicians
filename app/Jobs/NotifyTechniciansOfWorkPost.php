<?php

namespace App\Jobs;

use App\Models\WorkerProfile;
use App\Models\WorkPost;
use App\Models\WorkPostNotification;
use App\Services\WhatsAppService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Str;

class NotifyTechniciansOfWorkPost implements ShouldQueue
{
    use Queueable;

    /** Cap per post so one post can never blast the whole platform. */
    public const MAX_RECIPIENTS = 50;

    public function __construct(public WorkPost $post)
    {
    }

    public function handle(WhatsAppService $whatsapp): void
    {
        $post = $this->post->fresh(['category', 'user']);

        if (! $post || $post->status !== 'open') {
            return;
        }

        foreach ($this->matchingTechnicians($post) as $profile) {
            $notification = WorkPostNotification::firstOrCreate(
                [
                    'work_post_id' => $post->id,
                    'user_id' => $profile->user_id,
                    'channel' => 'whatsapp',
                ],
                ['status' => 'queued'],
            );

            // Already handled by a previous run (e.g. job retry)
            if (! $notification->wasRecentlyCreated && $notification->status !== 'queued') {
                continue;
            }

            if (! $whatsapp->isConfigured()) {
                $notification->update(['status' => 'skipped', 'error' => 'whatsapp_not_configured']);
                continue;
            }

            $result = $whatsapp->sendTemplate($profile->user->phone, [
                $post->category?->name ?? 'NexJobs',
                trim(implode(', ', array_filter([$post->city, $post->state]))) ?: 'Cameroon',
                Str::limit($post->description, 120),
            ]);

            $notification->update([
                'status' => $result['error'] === null ? 'sent' : 'failed',
                'wa_message_id' => $result['id'],
                'error' => $result['error'] ? Str::limit($result['error'], 250) : null,
            ]);
        }
    }

    /**
     * Technicians to notify: active users with a phone, excluding the poster.
     * Filtered to the post's trade when one is set; technicians in the post's
     * region (or willing to relocate) are prioritized when the cap applies.
     */
    private function matchingTechnicians(WorkPost $post)
    {
        $query = WorkerProfile::with('user:id,phone')
            ->whereHas('user', fn ($q) => $q
                ->whereNotNull('phone')
                ->where('is_active', true)
                ->where('id', '!=', $post->user_id));

        if ($post->category_id) {
            $query->whereHas('jobCategories', fn ($q) => $q->where('job_categories.id', $post->category_id));
        }

        if ($post->state) {
            $query->orderByRaw(
                'CASE WHEN state = ? THEN 0 WHEN willing_to_relocate = 1 THEN 1 ELSE 2 END',
                [$post->state],
            );
        }

        return $query
            ->latest()
            ->limit(self::MAX_RECIPIENTS)
            ->get();
    }
}
