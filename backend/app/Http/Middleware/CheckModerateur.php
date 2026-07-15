<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckModerateur
{
    public function handle(Request $request, Closure $next)
    {
        if (!$request->user() || !$request->user()->estModerateur()) {
            return response()->json(['message' => 'Acces reserve aux moderateurs.'], 403);
        }

        return $next($request);
    }
}
