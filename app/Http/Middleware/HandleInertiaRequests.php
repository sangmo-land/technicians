<?php

namespace App\Http\Middleware;

use App\Models\JobCategory;
use App\Models\SiteVisit;
use App\Models\User;
use App\Models\WorkerProfile;
use App\Models\WorkPostNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                'worker_profile_id' => fn () => $request->user()?->workerProfile?->id,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'profileIncomplete' => fn () => $this->checkProfileIncomplete($request),
            'unreadNotifications' => fn () => $request->user()
                ? WorkPostNotification::where('user_id', $request->user()->id)->whereNull('read_at')->count()
                : 0,
            'siteVisits' => fn () => SiteVisit::count(),
            'adminPhone' => fn () => User::where('email', 'admin@nexjobs.com')->value('phone'),
            'footerCategories' => fn () => Cache::remember(
                'footer_categories',
                600,
                fn () => JobCategory::where('is_active', true)
                    ->withCount(['workerProfiles' => fn ($q) => $q->workersOnly()])
                    ->orderByDesc('worker_profiles_count')
                    ->orderBy('name')
                    ->take(4)
                    ->get(['id', 'name'])
            ),
        ];
    }

    private function checkProfileIncomplete(Request $request): bool
    {
        $user = $request->user();

        if (! $user || $user->role !== 'worker') {
            return false;
        }

        $profile = $user->workerProfile;

        if (! $profile) {
            return true;
        }

        return ! $profile->bio
            || ! $user->phone
            || ! $profile->state
            || ! $profile->experience_level
            || ! ($profile->daily_rate > 0);
    }
}
