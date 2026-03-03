<?php

namespace App\Http\Controllers;

use App\Models\WorkerProfile;
use App\Models\JobCategory;
use App\Models\Skill;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WorkerProfileController extends Controller
{
    public function index(Request $request)
    {
        $query = WorkerProfile::with(['user.reviewsReceived', 'skills', 'jobCategories', 'portfolioPhotos']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%")
                    ->orWhereHas('user', fn ($q) => $q->where('name', 'like', "%{$search}%"))
                    ->orWhereHas('skills', fn ($q) => $q->where('name', 'like', "%{$search}%"))
                    ->orWhereHas('jobCategories', fn ($q) => $q->where('name', 'like', "%{$search}%"));
            });
        }

        if ($request->filled('category')) {
            $query->whereHas('jobCategories', fn ($q) => $q->where('job_categories.id', $request->category));
        }

        if ($request->filled('experience')) {
            $query->where('experience_level', $request->experience);
        }

        if ($request->filled('availability')) {
            $query->where('availability', $request->availability);
        }

        if ($request->filled('location')) {
            $query->where('location', 'like', "%{$request->location}%");
        }

        $workers = $query->where('availability', '!=', 'not_available')
            ->latest()
            ->paginate(12)
            ->withQueryString();

        $categories = JobCategory::withCount('workerProfiles')->where('is_active', true)->get();

        return Inertia::render('Workers/Index', [
            'workers' => $workers,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category', 'experience', 'availability', 'location']),
        ]);
    }

    public function show(WorkerProfile $worker)
    {
        $worker->increment('profile_views');
        $worker->load(['user.reviewsReceived.reviewer', 'skills', 'jobCategories', 'workExperiences', 'portfolioPhotos']);

        return Inertia::render('Workers/Show', [
            'worker' => $worker,
        ]);
    }

    public function edit()
    {
        $profile = auth()->user()->workerProfile;

        if (!$profile) {
            $profile = WorkerProfile::create([
                'user_id' => auth()->id(),
            ]);
        }

        $profile->load(['skills', 'jobCategories', 'workExperiences']);

        $categories = JobCategory::with('skills')->where('is_active', true)->get();
        $allSkills = Skill::orderBy('name')->get();

        return Inertia::render('Workers/Edit', [
            'profile' => $profile,
            'categories' => $categories,
            'allSkills' => $allSkills,
        ]);
    }

    public function update(Request $request)
    {
        // Convert comma-separated strings to arrays if needed
        if (is_string($request->certifications)) {
            $request->merge([
                'certifications' => array_values(array_filter(array_map('trim', explode(',', $request->certifications)))),
            ]);
        }
        if (is_string($request->languages)) {
            $request->merge([
                'languages' => array_values(array_filter(array_map('trim', explode(',', $request->languages)))),
            ]);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'bio' => 'required|string|max:5000',
            'city' => 'required|string|max:100',
            'state' => 'required|string|max:100',
            'years_experience' => 'required|integer|min:0',
            'experience_level' => 'required|in:entry,intermediate,experienced,expert',
            'hourly_rate' => 'required|numeric|min:0',
            'daily_rate' => 'required|numeric|min:0',
            'availability' => 'required|in:available,busy,not_available',
            'skills' => 'nullable|array',
            'skills.*' => 'exists:skills,id',
            'categories' => 'required|array|min:1',
            'categories.*' => 'exists:job_categories,id',
            'certifications' => 'nullable|array',
            'languages' => 'required|array|min:1',
        ]);

        $profile = auth()->user()->workerProfile;

        $profile->update($request->only([
            'title', 'bio', 'city', 'state',
            'years_experience', 'experience_level',
            'hourly_rate', 'daily_rate', 'availability',
            'certifications', 'languages',
        ]));

        // Sync skills
        if ($request->has('skills')) {
            $profile->skills()->sync($request->skills);
        }

        // Sync categories
        if ($request->has('categories')) {
            $profile->jobCategories()->sync($request->categories);
        }

        return back()->with('success', 'Profile updated successfully!');
    }
}
