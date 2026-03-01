<?php

namespace App\Http\Controllers;

use App\Models\SavedJob;
use App\Models\JobListing;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SavedJobController extends Controller
{
    public function toggle(JobListing $job)
    {
        $saved = SavedJob::where('user_id', auth()->id())
            ->where('job_listing_id', $job->id)
            ->first();

        if ($saved) {
            $saved->delete();
            return back()->with('success', 'Job removed from saved.');
        }

        SavedJob::create([
            'user_id' => auth()->id(),
            'job_listing_id' => $job->id,
        ]);

        return back()->with('success', 'Job saved!');
    }

    public function index()
    {
        $saved = auth()->user()->savedJobs()
            ->with(['jobListing.company', 'jobListing.jobCategory'])
            ->latest()
            ->paginate(12);

        return Inertia::render('SavedJobs/Index', [
            'savedJobs' => $saved,
        ]);
    }
}
