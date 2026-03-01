<?php

namespace App\Http\Controllers;

use App\Models\JobApplication;
use App\Models\JobListing;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JobApplicationController extends Controller
{
    public function store(Request $request, JobListing $job)
    {
        $request->validate([
            'cover_letter' => 'nullable|string|max:5000',
            'expected_salary' => 'nullable|numeric',
            'available_start_date' => 'nullable|date',
        ]);

        $existing = JobApplication::where('job_listing_id', $job->id)
            ->where('user_id', auth()->id())
            ->first();

        if ($existing) {
            return back()->with('error', 'You have already applied to this job.');
        }

        JobApplication::create([
            'job_listing_id' => $job->id,
            'user_id' => auth()->id(),
            'cover_letter' => $request->cover_letter,
            'expected_salary' => $request->expected_salary,
            'available_start_date' => $request->available_start_date,
            'status' => 'pending',
        ]);

        return back()->with('success', 'Application submitted successfully!');
    }

    public function myApplications()
    {
        $applications = auth()->user()->jobApplications()
            ->with(['jobListing.company', 'jobListing.jobCategory'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Applications/Index', [
            'applications' => $applications,
        ]);
    }

    public function withdraw(JobApplication $application)
    {
        if ($application->user_id !== auth()->id()) {
            abort(403);
        }

        $application->update(['status' => 'withdrawn']);

        return back()->with('success', 'Application withdrawn.');
    }

    // Employer: manage applications for their jobs
    public function manage(JobListing $job)
    {
        if ($job->user_id !== auth()->id()) {
            abort(403);
        }

        $applications = $job->applications()
            ->with(['user.workerProfile.skills', 'user.workerProfile.jobCategories'])
            ->latest()
            ->paginate(20);

        return Inertia::render('Applications/Manage', [
            'job' => $job->load(['company', 'jobCategory']),
            'applications' => $applications,
        ]);
    }

    public function updateStatus(Request $request, JobApplication $application)
    {
        $request->validate([
            'status' => 'required|in:reviewed,shortlisted,interview,offered,accepted,rejected',
            'employer_notes' => 'nullable|string|max:2000',
        ]);

        $application->update([
            'status' => $request->status,
            'employer_notes' => $request->employer_notes,
            'reviewed_at' => now(),
        ]);

        return back()->with('success', 'Application status updated.');
    }
}
