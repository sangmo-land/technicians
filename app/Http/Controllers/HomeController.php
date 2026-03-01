<?php

namespace App\Http\Controllers;

use App\Models\JobCategory;
use App\Models\WorkerProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        $categories = JobCategory::withCount(['workerProfiles'])
            ->where('is_active', true)
            ->get();

        $stats = [
            'total_workers' => WorkerProfile::count(),
            'total_categories' => JobCategory::where('is_active', true)->count(),
        ];

        // Paginated technicians (available workers)
        $techniciansQuery = WorkerProfile::with(['user', 'skills', 'jobCategories', 'portfolioPhotos' => fn ($q) => $q->orderBy('sort_order')->limit(1)])
            ->where('availability', '!=', 'not_available');

        if ($request->filled('tech_category')) {
            $techniciansQuery->whereHas('jobCategories', fn ($q) => $q->where('job_categories.id', $request->tech_category));
        }

        if ($request->filled('tech_search')) {
            $search = $request->tech_search;
            $techniciansQuery->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%")
                    ->orWhereHas('user', fn ($q) => $q->where('name', 'like', "%{$search}%"))
                    ->orWhereHas('skills', fn ($q) => $q->where('name', 'like', "%{$search}%"));
            });
        }

        $technicians = $techniciansQuery
            ->latest()
            ->paginate(12, ['*'], 'tech_page')
            ->withQueryString();

        return Inertia::render('Welcome', [
            'categories' => $categories,
            'stats' => $stats,
            'technicians' => $technicians,
            'techFilters' => $request->only(['tech_search', 'tech_category']),
        ]);
    }
}
