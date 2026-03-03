<?php

namespace App\Http\Controllers;

use App\Models\WorkerProfile;
use App\Models\WorkExperience;
use App\Models\PortfolioPhoto;
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

        $profile->load(['user', 'skills', 'jobCategories', 'workExperiences', 'portfolioPhotos']);

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
            'phone' => 'required|string|max:30',
            'city' => 'required|string|max:100',
            'state' => 'required|string|max:100',
            'years_experience' => 'required|integer|min:0',
            'experience_level' => 'required|in:entry,intermediate,experienced,expert',
            'hourly_rate' => 'nullable|numeric|min:0',
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

        // Update phone on user record
        auth()->user()->update(['phone' => $request->phone]);

        // Sync skills
        if ($request->has('skills')) {
            $profile->skills()->sync($request->skills);
        }

        // Sync categories
        if ($request->has('categories')) {
            $profile->jobCategories()->sync($request->categories);
        }

        // Sync work experiences
        if ($request->has('work_experiences')) {
            $existingIds = [];
            foreach ($request->work_experiences as $expData) {
                if (!empty($expData['job_title']) && !empty($expData['company_name']) && !empty($expData['start_date'])) {
                    if (!empty($expData['id'])) {
                        // Update existing
                        $exp = $profile->workExperiences()->find($expData['id']);
                        if ($exp) {
                            $exp->update([
                                'job_title' => $expData['job_title'],
                                'company_name' => $expData['company_name'],
                                'project_name' => $expData['project_name'] ?? null,
                                'description' => $expData['description'] ?? null,
                                'location' => $expData['location'] ?? null,
                                'start_date' => $expData['start_date'],
                                'end_date' => !empty($expData['is_current']) ? null : ($expData['end_date'] ?? null),
                                'is_current' => !empty($expData['is_current']),
                            ]);
                            $existingIds[] = $exp->id;
                        }
                    } else {
                        // Create new
                        $exp = $profile->workExperiences()->create([
                            'job_title' => $expData['job_title'],
                            'company_name' => $expData['company_name'],
                            'project_name' => $expData['project_name'] ?? null,
                            'description' => $expData['description'] ?? null,
                            'location' => $expData['location'] ?? null,
                            'start_date' => $expData['start_date'],
                            'end_date' => !empty($expData['is_current']) ? null : ($expData['end_date'] ?? null),
                            'is_current' => !empty($expData['is_current']),
                        ]);
                        $existingIds[] = $exp->id;
                    }
                }
            }
            // Delete removed experiences
            $profile->workExperiences()->whereNotIn('id', $existingIds)->delete();
        }

        return back()->with('success', 'Profile updated successfully!');
    }

    public function uploadAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        $user = auth()->user();

        // Delete old avatar if exists
        if ($user->avatar) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($user->avatar);
        }

        $path = $request->file('avatar')->store('avatars', 'public');
        $user->update(['avatar' => $path]);

        return back()->with('success', 'Profile photo updated!');
    }

    public function uploadPhoto(Request $request)
    {
        $request->validate([
            'photos' => 'required|array|max:10',
            'photos.*' => 'image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        $profile = auth()->user()->workerProfile;
        if (!$profile) {
            return back()->withErrors(['photos' => 'Worker profile not found.']);
        }

        $currentCount = $profile->portfolioPhotos()->count();
        $maxPhotos = 12;

        $uploaded = [];
        foreach ($request->file('photos') as $photo) {
            if ($currentCount >= $maxPhotos) break;

            $path = $photo->store('portfolio/' . $profile->id, 'public');

            $uploaded[] = $profile->portfolioPhotos()->create([
                'path' => $path,
                'caption' => null,
                'sort_order' => $currentCount,
            ]);

            $currentCount++;
        }

        return back()->with('success', count($uploaded) . ' photo(s) uploaded successfully!');
    }

    public function deletePhoto(PortfolioPhoto $photo)
    {
        $profile = auth()->user()->workerProfile;
        if (!$profile || $photo->worker_profile_id !== $profile->id) {
            abort(403);
        }

        // Delete file from storage
        \Illuminate\Support\Facades\Storage::disk('public')->delete($photo->path);
        $photo->delete();

        return back()->with('success', 'Photo deleted successfully!');
    }

    public function updatePhotoCaption(Request $request, PortfolioPhoto $photo)
    {
        $profile = auth()->user()->workerProfile;
        if (!$profile || $photo->worker_profile_id !== $profile->id) {
            abort(403);
        }

        $request->validate(['caption' => 'nullable|string|max:255']);
        $photo->update(['caption' => $request->caption]);

        return back()->with('success', 'Caption updated!');
    }
}
