<?php

namespace App\Http\Middleware;

use App\Models\SiteVisit;
use Closure;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TrackSiteVisits
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->isMethod('GET') || $request->ajax() || $request->wantsJson()) {
            return $next($request);
        }

        try {
            SiteVisit::firstOrCreate([
                'ip_address' => $request->ip(),
                'visited_at' => now()->toDateString(),
            ]);
        } catch (UniqueConstraintViolationException) {
            // A concurrent request from the same IP already recorded today's visit.
        }

        return $next($request);
    }
}
