<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class GeocodeController extends Controller
{
    // POST /api/geocode
    // Proxy vers Nominatim/OpenStreetMap (prestataire extérieur requis par le sujet)
    public function geocode(Request $request)
    {
        $request->validate(['adresse' => 'required|string']);

        $response = Http::withHeaders([
            'User-Agent' => 'UrbNet/1.0 (projet-scolaire)',
        ])->get('https://nominatim.openstreetmap.org/search', [
            'q'      => $request->adresse,
            'format' => 'json',
            'limit'  => 5,
        ]);

        if ($response->failed()) {
            return response()->json(['message' => 'Erreur lors du géocodage.'], 502);
        }

        return response()->json($response->json());
    }
}
