<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lieu;
use App\Models\Photo;
use Illuminate\Http\Request;

// Seuil de réputation pour voir les coordonnées précises
const SEUIL_COORDS = 10;

class LieuController extends Controller
{
    // GET /api/lieux
    public function index(Request $request)
    {
        $query = Lieu::with(['utilisateur:id,pseudo', 'photos'])->where('statut', 'valide');

        if ($request->has('niveau_risque')) {
            $query->where('niveau_risque', $request->niveau_risque);
        }

        $lieux = $query->get()->map(fn($lieu) => $this->masquerCoords($lieu, $request->user()));

        return response()->json($lieux);
    }

    // GET /api/lieux/{id}
    public function show(Request $request, int $id)
    {
        $lieu = Lieu::with(['utilisateur:id,pseudo', 'photos', 'commentaires.utilisateur:id,pseudo'])
            ->findOrFail($id);

        $lieu = $this->masquerCoords($lieu, $request->user());
        $lieu->note_moyenne = $lieu->calculerNoteMoyenne();

        return response()->json($lieu);
    }

    // POST /api/lieux
    public function store(Request $request)
    {
        $data = $request->validate([
            'nom'          => 'required|string|max:255',
            'description'  => 'required|string',
            'latitude'     => 'required|numeric|between:-90,90',
            'longitude'    => 'required|numeric|between:-180,180',
            'niveau_risque'=> 'required|in:faible,moyen,eleve',
            'photo'        => 'nullable|file|image|max:5120',
        ]);

        $lieu = Lieu::create([
            'nom'           => $data['nom'],
            'description'   => $data['description'],
            'latitude'      => $data['latitude'],
            'longitude'     => $data['longitude'],
            'niveau_risque' => $data['niveau_risque'],
            'statut'        => 'en_attente',
            'date_creation' => now()->toDateString(),
            'utilisateur_id'=> $request->user()->id,
        ]);

        // Upload de la photo si fournie
        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('photos', 'public');
            Photo::create([
                'url'         => '/storage/' . $path,
                'date_upload' => now()->toDateString(),
                'lieu_id'     => $lieu->id,
            ]);
        }

        return response()->json($lieu->load('photos'), 201);
    }

    // PATCH /api/lieux/{id}
    public function update(Request $request, int $id)
    {
        $lieu = Lieu::findOrFail($id);

        // Seul le propriétaire peut modifier
        if ($lieu->utilisateur_id !== $request->user()->id) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $data = $request->validate([
            'nom'          => 'sometimes|string|max:255',
            'description'  => 'sometimes|string',
            'niveau_risque'=> 'sometimes|in:faible,moyen,eleve',
        ]);

        $lieu->update($data);

        return response()->json($lieu);
    }

    // Floute les coordonnées si l'utilisateur n'a pas assez de réputation
    private function masquerCoords(Lieu $lieu, ?object $user): Lieu
    {
        if (!$user || $user->niveau_reputation < SEUIL_COORDS) {
            $lieu->latitude  = round($lieu->latitude, 1);
            $lieu->longitude = round($lieu->longitude, 1);
            $lieu->coords_floutees = true;
        } else {
            $lieu->coords_floutees = false;
        }
        return $lieu;
    }
}
