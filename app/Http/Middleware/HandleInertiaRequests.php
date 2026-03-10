<?php

namespace App\Http\Middleware;

use App\Models\SiteVisit;
use App\Models\User;
use App\Models\WorkerProfile;
use Illuminate\Http\Request;
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
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'profileIncomplete' => fn () => $this->checkProfileIncomplete($request),
            'siteVisits' => fn () => SiteVisit::count(),
            'adminPhone' => fn () => User::where('email', 'admin@nexjobs.com')->value('phone'),
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
