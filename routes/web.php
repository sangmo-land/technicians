<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\JobListingController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WorkerProfileController;
use App\Models\JobListing;
use App\Models\WorkerProfile;
use App\Models\JobCategory;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Sitemap
Route::get('/sitemap.xml', function () {
    $workers = WorkerProfile::with('user')->whereNotNull('title')->latest()->take(10)->get();
    $categories = JobCategory::where('is_active', true)->take(10)->get();
    $jobs = JobListing::active()->latest()->take(10)->get();

    $staticPages = [
        ['url' => '/', 'priority' => '1.0', 'changefreq' => 'daily'],
        ['url' => '/workers', 'priority' => '0.9', 'changefreq' => 'daily'],
        ['url' => '/jobs', 'priority' => '0.9', 'changefreq' => 'daily'],
        ['url' => '/login', 'priority' => '0.5', 'changefreq' => 'monthly'],
        ['url' => '/register', 'priority' => '0.5', 'changefreq' => 'monthly'],
    ];

    return response()
        ->view('sitemap', compact('workers', 'categories', 'jobs', 'staticPages'))
        ->header('Content-Type', 'application/xml');
})->name('sitemap');

// Public routes
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/workers', [WorkerProfileController::class, 'index'])->name('workers.index');
Route::get('/workers/{worker}', [WorkerProfileController::class, 'show'])->name('workers.show');
Route::get('/jobs', [JobListingController::class, 'index'])->name('jobs.index');
Route::get('/jobs/{job}', [JobListingController::class, 'show'])->name('jobs.show');

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
