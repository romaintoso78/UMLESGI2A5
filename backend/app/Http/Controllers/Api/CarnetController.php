<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CarnetDeVisite;
use App\Models\Lieu;
use Illuminate\Http\Request;

class CarnetController extends Controller
{
    // GET /api/lieux/{id}/carnets
    public function index(int $lieuId)
    {
        $carnets = CarnetDeVisite::with('utilisateur:id,pseudo')
            ->where('lieu_id', $lieuId)
            ->latest()
            ->get();

        return response()->json($carnets);
    }

    // POST /api/lieux/{id}/carnets
    public function store(Request $request, int $lieuId)
    {
        Lieu::findOrFail($lieuId); // 404 si lieu inexistant

        $data = $request->validate([
            'date_visite'  => 'required|date',
            'compte_rendu' => 'required|string',
            'duree_visite' => 'required|integer|min:1',
        ]);

        $carnet = CarnetDeVisite::create([
            ...$data,
            'utilisateur_id' => $request->user()->id,
            'lieu_id'        => $lieuId,
        ]);

        // +5 points de réputation pour chaque carnet ajouté
        $request->user()->gagnerReputation(5);

        return response()->json($carnet->load('utilisateur:id,pseudo'), 201);
    }
}
