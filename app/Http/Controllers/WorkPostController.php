<?php

namespace App\Http\Controllers;

use App\Jobs\NotifyTechniciansOfWorkPost;
use App\Models\JobCategory;
use App\Models\WorkerProfile;
use App\Models\WorkPost;
use App\Models\WorkPostInterest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WorkPostController extends Controller
{
    public function index(Request $request)
    {
        $postsQuery = WorkPost::with([
            'user:id,name,avatar',
            'user.workerProfile:id,user_id',
            'category:id,name',
            'interests' => fn ($q) => $q->latest()->with([
                'user:id,name,phone,avatar',
                'user.workerProfile:id,user_id',
            ]),
        ])->withCount(['interests', 'notifications as notified_count']);

        if ($request->filled('category')) {
            $postsQuery->where('category_id', $request->category);
        }

        if ($request->filled('region')) {
            $postsQuery->where('state', $request->region);
        }

        if ($request->filled('status')) {
            $postsQuery->where('status', $request->status);
        }

        $posts = $postsQuery
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Feed/Index', [
            'posts' => $posts,
            'categories' => JobCategory::where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'filters' => $request->only(['category', 'region', 'status']),
            'suggestedWorkers' => WorkerProfile::with(['user:id,name,avatar', 'jobCategories:id,name'])
                ->where('availability', '!=', 'not_available')
                ->latest()
                ->take(5)
                ->get(['id', 'user_id', 'title', 'city', 'state']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'description' => 'required|string|min:10|max:2000',
            'category_id' => 'nullable|exists:job_categories,id',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'technicians_needed' => 'nullable|integer|min:1|max:100',
            'budget' => 'nullable|string|max:100',
        ]);

        $post = $request->user()->workPosts()->create($validated);

        NotifyTechniciansOfWorkPost::dispatch($post);

        return back()->with('success', 'post_created');
    }

    public function toggleInterest(Request $request, WorkPost $post)
    {
        $user = $request->user();

        if ($post->user_id === $user->id) {
            return back()->with('error', 'own_post');
        }

        if (! $user->workerProfile) {
            return back()->with('error', 'no_worker_profile');
        }

        $existing = WorkPostInterest::where('work_post_id', $post->id)
            ->where('user_id', $user->id)
            ->first();

        if ($existing) {
            $existing->delete();

            return back()->with('success', 'interest_withdrawn');
        }

        $validated = $request->validate([
            'message' => 'nullable|string|max:500',
        ]);

        $post->interests()->create([
            'user_id' => $user->id,
            'message' => $validated['message'] ?? null,
        ]);

        return back()->with('success', 'interest_added');
    }

    public function updateStatus(Request $request, WorkPost $post)
    {
        if ($post->user_id !== $request->user()->id && ! $request->user()->isAdmin()) {
            abort(403);
        }

        $validated = $request->validate([
            'status' => 'required|in:open,filled,closed',
        ]);

        $post->update($validated);

        return back()->with('success', 'post_updated');
    }

    public function destroy(Request $request, WorkPost $post)
    {
        if ($post->user_id !== $request->user()->id && ! $request->user()->isAdmin()) {
            abort(403);
        }

        $post->delete();

        return back()->with('success', 'post_deleted');
    }
}
