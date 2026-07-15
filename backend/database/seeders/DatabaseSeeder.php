<?php

namespace Database\Seeders;

use App\Models\Badge;
use App\Models\CarnetDeVisite;
use App\Models\Commentaire;
use App\Models\Lieu;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $badges = [
            ["nom" => "Debutant",    "seuil_reputation" => 0,   "icone" => "magnifier"],
            ["nom" => "Explorateur", "seuil_reputation" => 10,  "icone" => "map"],
            ["nom" => "Veteran",     "seuil_reputation" => 50,  "icone" => "trophy"],
            ["nom" => "Legende",     "seuil_reputation" => 100, "icone" => "star"],
        ];
        foreach ($badges as $b) Badge::create($b);

        $modo = User::create([
            "pseudo"            => "ModoPierre",
            "email"             => "modo@urbnet.fr",
            "password"          => Hash::make("password"),
            "role"              => "moderateur",
            "niveau_reputation" => 100,
            "date_inscription"  => "2024-01-15",
            "date_nomination"   => "2024-03-01",
            "bio"               => "Moderateur officiel UrbNet.",
        ]);

        $user1 = User::create([
            "pseudo"            => "SaraUrbex",
            "email"             => "sara@urbnet.fr",
            "password"          => Hash::make("password"),
            "niveau_reputation" => 55,
            "date_inscription"  => "2024-02-10",
            "bio"               => "Passionnee d urbex depuis 5 ans.",
        ]);

        $user2 = User::create([
            "pseudo"            => "LeoBerger",
            "email"             => "leo@urbnet.fr",
            "password"          => Hash::make("password"),
            "niveau_reputation" => 5,
            "date_inscription"  => "2025-06-01",
        ]);

        $lieux = [
            ["nom" => "Usine Peugeot Abandonnee",     "description" => "Ancienne usine automobile des annees 90.",  "latitude" => 48.8566, "longitude" => 2.3522, "niveau_risque" => "moyen",  "statut" => "valide",     "date_creation" => "2024-04-01", "utilisateur_id" => $user1->id],
            ["nom" => "Chateau des Brumes",            "description" => "Manoir du XIXe siecle a l abandon.",        "latitude" => 47.3220, "longitude" => 5.0415, "niveau_risque" => "faible", "statut" => "valide",     "date_creation" => "2024-05-15", "utilisateur_id" => $user1->id],
            ["nom" => "Tunnel Ferroviaire Desaffecte", "description" => "Ancien tunnel de chemin de fer, 2,3 km.",  "latitude" => 45.7640, "longitude" => 4.8357, "niveau_risque" => "eleve",  "statut" => "valide",     "date_creation" => "2024-07-20", "utilisateur_id" => $user2->id],
            ["nom" => "Piscine Sovietique",            "description" => "Piscine inspiration sovietique.",            "latitude" => 50.6292, "longitude" => 3.0573, "niveau_risque" => "faible", "statut" => "en_attente", "date_creation" => "2025-06-28", "utilisateur_id" => $user2->id],
            ["nom" => "Hopital Saint-Lazare",          "description" => "Complexe hospitalier desaffecte en 2003.",  "latitude" => 43.2965, "longitude" => 5.3698, "niveau_risque" => "eleve",  "statut" => "valide",     "date_creation" => "2024-09-10", "utilisateur_id" => $user1->id],
        ];
        foreach ($lieux as $l) Lieu::create($l);

        $lieu1 = Lieu::find(1);
        $lieu2 = Lieu::find(2);

        CarnetDeVisite::create(["date_visite" => "2024-04-15", "compte_rendu" => "Visite incroyable ! Machines encore en place.",   "duree_visite" => 180, "utilisateur_id" => $user1->id, "lieu_id" => $lieu1->id]);
        CarnetDeVisite::create(["date_visite" => "2024-06-01", "compte_rendu" => "Manoir magnifique. Y aller tot le matin.",         "duree_visite" => 240, "utilisateur_id" => $user1->id, "lieu_id" => $lieu2->id]);
        CarnetDeVisite::create(["date_visite" => "2025-01-10", "compte_rendu" => "Premiere exploration, lumiere du soir parfaite.",  "duree_visite" => 90,  "utilisateur_id" => $user2->id, "lieu_id" => $lieu2->id]);

        Commentaire::create(["contenu" => "Lieu fantastique, bien conserve !", "date_creation" => "2024-04-16", "note" => 5, "utilisateur_id" => $user1->id, "lieu_id" => $lieu2->id]);
        Commentaire::create(["contenu" => "Ambiance pesante mais captivante.",  "date_creation" => "2025-01-12", "note" => 4, "utilisateur_id" => $user2->id, "lieu_id" => $lieu1->id]);

        $b0   = Badge::where("seuil_reputation", 0)->first();
        $b10  = Badge::where("seuil_reputation", 10)->first();
        $b50  = Badge::where("seuil_reputation", 50)->first();
        $b100 = Badge::where("seuil_reputation", 100)->first();

        $modo->badges()->attach([$b0->id, $b10->id, $b50->id, $b100->id]);
        $user1->badges()->attach([$b0->id, $b10->id, $b50->id]);
        $user2->badges()->attach([$b0->id]);
    }
}
