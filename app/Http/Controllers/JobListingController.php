<?php

namespace App\Http\Controllers;

use App\Models\JobListing;
use App\Models\JobCategory;
use App\Models\Skill;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JobListingController extends Controller
{
    public function index(Request $request)
    {
        $query = JobListing::with(['company', 'jobCategory', 'skills'])
            ->active();

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%")
                    ->orWhereHas('company', fn ($q) => $q->where('name', 'like', "%{$search}%"));
            });
        }

        // Category filter
        if ($request->filled('category')) {
            $query->where('job_category_id', $request->category);
        }

        // Location filter
        if ($request->filled('location')) {
            $query->where('location', 'like', "%{$request->location}%");
        }

        // Employment type filter
        if ($request->filled('type')) {
            $query->where('employment_type', $request->type);
        }

        // Experience level filter
        if ($request->filled('experience')) {
            $query->where('experience_level', $request->experience);
        }

        // Salary range
        if ($request->filled('salary_min')) {
            $query->where('salary_min', '>=', $request->salary_min);
        }
        if ($request->filled('salary_max')) {
            $query->where('salary_max', '<=', $request->salary_max);
        }

        // Sort
        $sort = $request->get('sort', 'latest');
        match ($sort) {
            'salary_high' => $query->orderByDesc('salary_max'),
            'salary_low' => $query->orderBy('salary_min'),
            'views' => $query->orderByDesc('views_count'),
            default => $query->latest(),
        };

        $jobs = $query->paginate(8)->withQueryString();

        // Add saved/applied status for authenticated users
        if (auth()->check()) {
            $userId = auth()->id();
            $savedJobIds = auth()->user()->savedJobs()->pluck('job_listing_id')->toArray();
            $appliedJobIds = auth()->user()->jobApplications()->pluck('job_listing_id')->toArray();

            $jobs->getCollection()->transform(function ($job) use ($savedJobIds, $appliedJobIds) {
                $job->is_saved = in_array($job->id, $savedJobIds);
                $job->has_applied = in_array($job->id, $appliedJobIds);
                return $job;
            });
        }

        $categories = JobCategory::where('is_active', true)->get();

        return Inertia::render('Jobs/Index', [
            'jobs' => $jobs,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category', 'location', 'type', 'experience', 'salary_min', 'salary_max', 'sort']),
        ]);
    }

    public function show(JobListing $job)
    {
        $job->increment('views_count');

        $job->load(['company', 'jobCategory', 'skills', 'applications']);

        $relatedJobs = JobListing::with(['company', 'jobCategory'])
            ->active()
            ->where('id', '!=', $job->id)
            ->where(function ($q) use ($job) {
                $q->where('job_category_id', $job->job_category_id)
                    ->orWhere('location', 'like', "%{$job->city}%");
            })
            ->take(4)
            ->get();

        $isSaved = false;
        $hasApplied = false;

        if (auth()->check()) {
            $isSaved = auth()->user()->savedJobs()->where('job_listing_id', $job->id)->exists();
            $hasApplied = auth()->user()->jobApplications()->where('job_listing_id', $job->id)->exists();
        }

        return Inertia::render('Jobs/Show', [
            'job' => $job,
            'relatedJobs' => $relatedJobs,
            'isSaved' => $isSaved,
            'hasApplied' => $hasApplied,
        ]);
    }
}
