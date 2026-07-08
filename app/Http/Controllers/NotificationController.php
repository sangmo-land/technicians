<?php

namespace App\Http\Controllers;

use App\Models\WorkPostNotification;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $userNotifications = WorkPostNotification::where('user_id', $request->user()->id);

        $notifications = (clone $userNotifications)
            ->with([
                'workPost:id,user_id,description,category_id,city,state,technicians_needed,budget,status,created_at',
                'workPost.user:id,name,avatar',
                'workPost.category:id,name',
            ])
            ->latest()
            ->paginate(15);

        // Everything is considered read once the page is opened; the page
        // itself still highlights the ones that were unread on arrival.
        $unreadIds = (clone $userNotifications)->whereNull('read_at')->pluck('id');
        (clone $userNotifications)->whereNull('read_at')->update(['read_at' => now()]);

        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications,
            'unreadIds' => $unreadIds,
        ]);
    }
}
