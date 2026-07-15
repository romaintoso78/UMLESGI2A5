<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Commentaire;
use App\Models\Lieu;
use Illuminate\Http\Request;

class CommentaireController extends Controller
{
    // POST /api/lieux/{id}/commentaires
    public function store(Request $request, int $lieuId)
    {
        Lieu::findOrFail($lieuId);

        $data = $request->validate([
            'contenu' => 'required|string',
            'note'    => 'required|integer|min:1|max:5',
        ]);

        $commentaire = Commentaire::create([
            ...$data,
            'date_creation'  => now()->toDateString(),
            'utilisateur_id' => $request->user()->id,
            'lieu_id'        => $lieuId,
        ]);

        return response()->json($commentaire->load('utilisateur:id,pseudo'), 201);
    }
}
