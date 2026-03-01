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
                    ->orWhereHas('skills', fn ($q) => $q->where('name', 'like', "%{$search}%"));
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
        $request->validate([
            'title' => 'nullable|string|max:255',
            'bio' => 'nullable|string|max:5000',
            'location' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'years_experience' => 'integer|min:0',
            'experience_level' => 'in:entry,intermediate,experienced,expert',
            'hourly_rate' => 'nullable|numeric|min:0',
            'daily_rate' => 'nullable|numeric|min:0',
            'availability' => 'in:available,busy,not_available',
            'willing_to_relocate' => 'boolean',
            'max_travel_distance' => 'nullable|integer|min:0',
            'skills' => 'nullable|array',
            'skills.*' => 'exists:skills,id',
            'categories' => 'nullable|array',
            'categories.*' => 'exists:job_categories,id',
            'primary_category' => 'nullable|exists:job_categories,id',
            'certifications' => 'nullable|array',
            'languages' => 'nullable|array',
        ]);

        $profile = auth()->user()->workerProfile;

        $profile->update($request->only([
            'title', 'bio', 'location', 'city', 'state',
            'years_experience', 'experience_level',
            'hourly_rate', 'daily_rate', 'availability',
            'willing_to_relocate', 'max_travel_distance',
            'certifications', 'languages',
        ]));

        // Sync skills
        if ($request->has('skills')) {
            $profile->skills()->sync($request->skills);
        }

        // Sync categories
        if ($request->has('categories')) {
            $categorySync = [];
            foreach ($request->categories as $catId) {
                $categorySync[$catId] = [
                    'is_primary' => $catId == $request->primary_category,
                ];
            }
            $profile->jobCategories()->sync($categorySync);
        }

        return back()->with('success', 'Profile updated successfully!');
    }
}
