<?php

namespace App\Http\Controllers;

use App\Models\JobCategory;
use App\Models\User;
use App\Models\WorkerProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class UserInviteController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        abort_unless($user->canAddUsers(), 403);

        $addedUsers = $user->addedUsers()
            ->select('id', 'name', 'email', 'phone', 'role', 'avatar', 'is_active', 'created_at')
            ->latest()
            ->get();

        $categories = JobCategory::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Users/AddUser', [
            'addedUsers' => $addedUsers,
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        abort_unless($user->canAddUsers(), 403);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'category_id' => 'required|exists:job_categories,id',
            'daily_rate' => 'required|numeric|min:0',
            'experience_level' => 'required|in:entry,intermediate,experienced,expert',
            'years_experience' => 'required|integer|min:0|max:50',
            'state' => 'required|string|max:100',
            'languages' => 'required|array|min:1',
            'languages.*' => 'in:English,French',
            'avatar' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
            'portfolio_photos' => 'nullable|array|max:10',
            'portfolio_photos.*' => 'image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        $name = $validated['name'];
        $emailBase = strtolower(str_replace(' ', '.', trim($name)));
        $email = $emailBase . '@mail.com';

        $counter = 1;
        while (User::where('email', $email)->exists()) {
            $email = $emailBase . $counter . '@mail.com';
            $counter++;
        }

        $password = strtolower(trim($name));

        $category = JobCategory::find($validated['category_id']);

        // Handle avatar upload
        $avatarPath = null;
        if ($request->hasFile('avatar')) {
            $avatarPath = $request->file('avatar')->store('avatars', 'public');
        }

        $newUser = User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
            'phone' => $validated['phone'] ?? null,
            'role' => 'worker',
            'is_active' => true,
            'added_by' => $user->id,
            'avatar' => $avatarPath,
        ]);

        $profile = WorkerProfile::create([
            'user_id' => $newUser->id,
            'title' => $category->name,
            'daily_rate' => $validated['daily_rate'],
            'experience_level' => $validated['experience_level'],
            'years_experience' => $validated['years_experience'],
            'state' => $validated['state'],
            'languages' => $validated['languages'],
            'availability' => 'available',
            'is_featured' => false,
            'profile_views' => 0,
            'willing_to_relocate' => false,
        ]);

        // Attach the selected category as primary
        $profile->jobCategories()->attach($validated['category_id'], ['is_primary' => true]);

        // Handle portfolio photos upload
        if ($request->hasFile('portfolio_photos')) {
            $sortOrder = 0;
            foreach ($request->file('portfolio_photos') as $photo) {
                $path = $photo->store('portfolio/' . $profile->id, 'public');
                $profile->portfolioPhotos()->create([
                    'path' => $path,
                    'caption' => null,
                    'sort_order' => $sortOrder,
                ]);
                $sortOrder++;
            }
        }

        return back()->with('success', "User '{$name}' created successfully. Email: {$email} | Password: {$password}");
    }
}
