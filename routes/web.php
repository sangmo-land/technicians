<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WorkerProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public routes
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/workers', [WorkerProfileController::class, 'index'])->name('workers.index');
Route::get('/workers/{worker}', [WorkerProfileController::class, 'show'])->name('workers.show');

// Dashboard
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
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
    Route::post('/worker/profile/photos', [WorkerProfileController::class, 'uploadPhoto'])->name('worker.profile.photos.upload');
    Route::delete('/worker/profile/photos/{photo}', [WorkerProfileController::class, 'deletePhoto'])->name('worker.profile.photos.delete');
    Route::patch('/worker/profile/photos/{photo}/caption', [WorkerProfileController::class, 'updatePhotoCaption'])->name('worker.profile.photos.caption');
});

require __DIR__.'/auth.php';
