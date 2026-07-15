<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lieu extends Model
{
    protected $table = "lieux";

    protected $fillable = [
        'nom', 'description', 'latitude', 'longitude',
        'niveau_risque', 'statut', 'date_creation', 'utilisateur_id',
    ];

    public function utilisateur() { return $this->belongsTo(User::class, 'utilisateur_id'); }
    public function photos() { return $this->hasMany(Photo::class); }
    public function carnets() { return $this->hasMany(CarnetDeVisite::class); }
    public function commentaires() { return $this->hasMany(Commentaire::class); }
    public function signalements() { return $this->hasMany(Signalement::class); }

    // Calcule la note moyenne des commentaires
    public function calculerNoteMoyenne(): float
    {
        return round($this->commentaires()->avg('note') ?? 0, 1);
    }
}
