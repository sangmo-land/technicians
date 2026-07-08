<?php

namespace App\Jobs;

use App\Models\WorkerProfile;
use App\Models\WorkPost;
use App\Models\WorkPostNotification;
use Illuminate\Foundation\Bus\Dispatchable;

/**
 * Creates in-app notifications for technicians when a work post is
 * published. Runs synchronously (plain DB inserts — no queue worker needed).
 */
class NotifyTechniciansOfWorkPost
{
    use Dispatchable;

    public function __construct(public WorkPost $post)
    {
    }

    public function handle(): void
    {
        // Reload so DB defaults (e.g. status = 'open') set outside Eloquent
        // are visible on a freshly created model.
        $post = $this->post->fresh();

        if (! $post || $post->status !== 'open') {
            return;
        }

        // Active technicians, excluding the poster, limited to the post's
        // trade when one is set.
        $userIds = WorkerProfile::query()
            ->whereHas('user', fn ($q) => $q
                ->where('is_active', true)
                ->where('id', '!=', $post->user_id))
            ->when($post->category_id, fn ($q) => $q
                ->whereHas('jobCategories', fn ($sub) => $sub->where('job_categories.id', $post->category_id)))
            ->pluck('user_id');

        if ($userIds->isEmpty()) {
            return;
        }

        $now = now();

        WorkPostNotification::insertOrIgnore(
            $userIds->map(fn ($userId) => [
                'work_post_id' => $post->id,
                'user_id' => $userId,
                'created_at' => $now,
                'updated_at' => $now,
            ])->all(),
        );
    }
}
