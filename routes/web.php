<?php

use App\Http\Controllers\EmployerController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\JobApplicationController;
use App\Http\Controllers\JobListingController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SavedJobController;
use App\Http\Controllers\WorkerProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public routes
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/jobs', [JobListingController::class, 'index'])->name('jobs.index');
Route::get('/jobs/{job:slug}', [JobListingController::class, 'show'])->name('jobs.show');
Route::get('/workers', [WorkerProfileController::class, 'index'])->name('workers.index');
Route::get('/workers/{worker}', [WorkerProfileController::class, 'show'])->name('workers.show');

// Dashboard (role-based redirect)
Route::get('/dashboard', function () {
    $user = auth()->user();
    if ($user->isEmployer()) {
        return redirect()->route('employer.dashboard');
    }
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

    // Job applications
    Route::post('/jobs/{job}/apply', [JobApplicationController::class, 'store'])->name('jobs.apply');
    Route::get('/my-applications', [JobApplicationController::class, 'myApplications'])->name('applications.mine');
    Route::post('/applications/{application}/withdraw', [JobApplicationController::class, 'withdraw'])->name('applications.withdraw');

    // Saved jobs
    Route::post('/jobs/{job}/save', [SavedJobController::class, 'toggle'])->name('jobs.save');
    Route::get('/saved-jobs', [SavedJobController::class, 'index'])->name('saved-jobs.index');

    // Employer routes
    Route::prefix('employer')->name('employer.')->group(function () {
        Route::get('/dashboard', [EmployerController::class, 'dashboard'])->name('dashboard');
        Route::get('/company', [EmployerController::class, 'companyEdit'])->name('company.edit');
        Route::put('/company', [EmployerController::class, 'companyUpdate'])->name('company.update');
        Route::get('/jobs/create', [EmployerController::class, 'jobCreate'])->name('jobs.create');
        Route::post('/jobs', [EmployerController::class, 'jobStore'])->name('jobs.store');
        Route::get('/my-jobs', [EmployerController::class, 'myJobs'])->name('jobs.index');
        Route::get('/jobs/{job}/applications', [JobApplicationController::class, 'manage'])->name('jobs.applications');
        Route::put('/applications/{application}/status', [JobApplicationController::class, 'updateStatus'])->name('applications.status');
    });
});

require __DIR__.'/auth.php';
