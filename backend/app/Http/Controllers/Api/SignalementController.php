<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lieu;
use App\Models\Signalement;
use Illuminate\Http\Request;

class SignalementController extends Controller
{
    // POST /api/lieux/{id}/signalements
    public function store(Request $request, int $lieuId)
    {
        Lieu::findOrFail($lieuId);

        $data = $request->validate([
            'type'        => 'required|in:danger,lieu_detruit,lieu_squatte',
            'description' => 'required|string',
        ]);

        $signalement = Signalement::create([
            ...$data,
            'date_signalement' => now()->toDateString(),
            'utilisateur_id'   => $request->user()->id,
            'lieu_id'          => $lieuId,
        ]);

        return response()->json($signalement, 201);
    }
}
