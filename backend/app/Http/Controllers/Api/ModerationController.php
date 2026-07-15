<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lieu;
use App\Models\Signalement;
use Illuminate\Http\Request;

class ModerationController extends Controller
{
    // GET /api/moderation/lieux-en-attente
    public function lieuxEnAttente()
    {
        $lieux = Lieu::with('utilisateur:id,pseudo', 'photos')
            ->where('statut', 'en_attente')
            ->latest()
            ->get();

        return response()->json($lieux);
    }

    // PATCH /api/moderation/lieux/{id}
    public function validerLieu(Request $request, int $id)
    {
        $data = $request->validate([
            'statut' => 'required|in:valide,rejete',
        ]);

        $lieu = Lieu::findOrFail($id);
        $lieu->update(['statut' => $data['statut']]);

        return response()->json($lieu);
    }

    // GET /api/moderation/signalements
    public function signalements()
    {
        $signalements = Signalement::with('utilisateur:id,pseudo', 'lieu:id,nom')
            ->where('statut', 'ouvert')
            ->latest()
            ->get();

        return response()->json($signalements);
    }

    // PATCH /api/moderation/signalements/{id}
    public function traiterSignalement(Request $request, int $id)
    {
        $signalement = Signalement::findOrFail($id);
        $signalement->update(['statut' => 'traite']);

        return response()->json($signalement);
    }
}
