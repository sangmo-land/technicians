<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\JobListing;
use App\Models\JobCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class EmployerController extends Controller
{
    public function dashboard()
    {
        $user = auth()->user();
        $company = $user->company;

        $stats = [];
        if ($company) {
            $stats = [
                'total_jobs' => $company->jobListings()->count(),
                'active_jobs' => $company->activeListings()->count(),
                'total_applications' => \App\Models\JobApplication::whereHas('jobListing', fn ($q) => $q->where('company_id', $company->id))->count(),
                'pending_applications' => \App\Models\JobApplication::whereHas('jobListing', fn ($q) => $q->where('company_id', $company->id))->where('status', 'pending')->count(),
            ];
        }

        $recentApplications = [];
        if ($company) {
            $recentApplications = \App\Models\JobApplication::whereHas('jobListing', fn ($q) => $q->where('company_id', $company->id))
                ->with(['user.workerProfile', 'jobListing'])
                ->latest()
                ->take(5)
                ->get();
        }

        return Inertia::render('Employer/Dashboard', [
            'company' => $company,
            'stats' => $stats,
            'recentApplications' => $recentApplications,
        ]);
    }

    public function companyEdit()
    {
        $company = auth()->user()->company;

        return Inertia::render('Employer/CompanyEdit', [
            'company' => $company,
        ]);
    }

    public function companyUpdate(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:5000',
            'website' => 'nullable|url|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
            'company_size' => 'nullable|in:1-10,11-50,51-200,201-500,500+',
            'founded_year' => 'nullable|integer|min:1900|max:' . date('Y'),
        ]);

        $user = auth()->user();
        $company = $user->company;

        $data = $request->only([
            'name', 'description', 'website', 'email', 'phone',
            'address', 'city', 'state', 'country', 'company_size', 'founded_year',
        ]);

        if ($company) {
            $company->update($data);
        } else {
            $data['user_id'] = $user->id;
            $data['slug'] = Str::slug($data['name']) . '-' . rand(100, 999);
            Company::create($data);
        }

        return back()->with('success', 'Company profile updated.');
    }

    public function jobCreate()
    {
        $categories = JobCategory::with('skills')->where('is_active', true)->get();

        return Inertia::render('Employer/JobCreate', [
            'categories' => $categories,
        ]);
    }

    public function jobStore(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'job_category_id' => 'required|exists:job_categories,id',
            'description' => 'required|string',
            'requirements' => 'nullable|string',
            'responsibilities' => 'nullable|string',
            'benefits' => 'nullable|string',
            'employment_type' => 'required|in:full_time,part_time,contract,temporary,daily',
            'salary_min' => 'nullable|numeric|min:0',
            'salary_max' => 'nullable|numeric|min:0',
            'salary_period' => 'required|in:hourly,daily,weekly,monthly,yearly',
            'location' => 'required|string|max:255',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'experience_level' => 'required|in:entry,intermediate,experienced,expert',
            'positions_available' => 'integer|min:1',
            'application_deadline' => 'nullable|date|after:today',
            'start_date' => 'nullable|date',
            'project_name' => 'nullable|string|max:255',
            'project_duration_months' => 'nullable|integer|min:1',
            'skills' => 'nullable|array',
            'skills.*' => 'exists:skills,id',
        ]);

        $company = auth()->user()->company;

        if (!$company) {
            return back()->with('error', 'Please create a company profile first.');
        }

        $job = JobListing::create([
            ...$request->only([
                'title', 'job_category_id', 'description', 'requirements',
                'responsibilities', 'benefits', 'employment_type',
                'salary_min', 'salary_max', 'salary_period', 'location',
                'city', 'state', 'experience_level', 'positions_available',
                'application_deadline', 'start_date', 'project_name', 'project_duration_months',
            ]),
            'company_id' => $company->id,
            'user_id' => auth()->id(),
            'slug' => Str::slug($request->title) . '-' . rand(1000, 9999),
            'status' => 'active',
        ]);

        if ($request->has('skills')) {
            $job->skills()->sync($request->skills);
        }

        return redirect()->route('employer.dashboard')->with('success', 'Job listing created!');
    }

    public function myJobs()
    {
        $company = auth()->user()->company;

        $jobs = collect();
        if ($company) {
            $jobs = $company->jobListings()
                ->withCount('applications')
                ->latest()
                ->paginate(10);
        }

        return Inertia::render('Employer/MyJobs', [
            'jobs' => $jobs,
        ]);
    }
}
