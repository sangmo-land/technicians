<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WorkerProfileController;
use App\Models\WorkerProfile;
use App\Models\JobCategory;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Sitemap
Route::get('/sitemap.xml', function () {
    $workers = WorkerProfile::with('user')->whereNotNull('title')->get();
    $categories = JobCategory::where('is_active', true)->get();

    $content = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    $content .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

    // Static pages
    $staticPages = [
        ['url' => '/', 'priority' => '1.0', 'changefreq' => 'daily'],
        ['url' => '/workers', 'priority' => '0.9', 'changefreq' => 'daily'],
        ['url' => '/login', 'priority' => '0.5', 'changefreq' => 'monthly'],
        ['url' => '/register', 'priority' => '0.5', 'changefreq' => 'monthly'],
    ];

    foreach ($staticPages as $page) {
        $content .= '  <url>' . "\n";
        $content .= '    <loc>' . url($page['url']) . '</loc>' . "\n";
        $content .= '    <changefreq>' . $page['changefreq'] . '</changefreq>' . "\n";
        $content .= '    <priority>' . $page['priority'] . '</priority>' . "\n";
        $content .= '  </url>' . "\n";
    }

    // Category-filtered worker pages
    foreach ($categories as $cat) {
        $content .= '  <url>' . "\n";
        $content .= '    <loc>' . url('/workers?category=' . $cat->id) . '</loc>' . "\n";
        $content .= '    <changefreq>daily</changefreq>' . "\n";
        $content .= '    <priority>0.8</priority>' . "\n";
        $content .= '  </url>' . "\n";
    }

    // Individual worker profiles
    foreach ($workers as $worker) {
        $content .= '  <url>' . "\n";
        $content .= '    <loc>' . url('/workers/' . $worker->id) . '</loc>' . "\n";
        $content .= '    <lastmod>' . $worker->updated_at->toW3cString() . '</lastmod>' . "\n";
        $content .= '    <changefreq>weekly</changefreq>' . "\n";
        $content .= '    <priority>0.7</priority>' . "\n";
        $content .= '  </url>' . "\n";
    }

    $content .= '</urlset>';

    return response($content, 200, ['Content-Type' => 'application/xml']);
})->name('sitemap');

// Public routes
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/workers', [WorkerProfileController::class, 'index'])->name('workers.index');
Route::get('/workers/{worker}', [WorkerProfileController::class, 'show'])->name('workers.show');

// Dashboard
Route::get('/dashboard', function () {
    $user = auth()->user();
    $profile = $user->workerProfile?->load(['jobCategories', 'portfolioPhotos', 'workExperiences']);
    $stats = [
        'profileViews' => $profile->profile_views ?? 0,
        'portfolioPhotos' => $profile?->portfolioPhotos?->count() ?? 0,
        'workExperiences' => $profile?->workExperiences?->count() ?? 0,
        'categories' => $profile?->jobCategories?->count() ?? 0,
    ];

    return Inertia::render('Dashboard', [
        'profile' => $profile,
        'stats' => $stats,
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

// Authenticated routes
Route::middleware('auth')->group(function () {
    // Profile (Breeze default)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Worker profile
    Route::get('/worker/profile', [WorkerProfileController::class, 'edit'])->name('worker.profile.edit');
    Route::put('/worker/profile', [WorkerProfileController::class, 'update'])->name('worker.profile.update');
    Route::post('/worker/profile/avatar', [WorkerProfileController::class, 'uploadAvatar'])->name('worker.profile.avatar.upload');
    Route::post('/worker/profile/photos', [WorkerProfileController::class, 'uploadPhoto'])->name('worker.profile.photos.upload');
    Route::delete('/worker/profile/photos/{photo}', [WorkerProfileController::class, 'deletePhoto'])->name('worker.profile.photos.delete');
    Route::patch('/worker/profile/photos/{photo}/caption', [WorkerProfileController::class, 'updatePhotoCaption'])->name('worker.profile.photos.caption');
});

require __DIR__.'/auth.php';
