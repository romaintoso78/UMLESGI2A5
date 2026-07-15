<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CarnetDeVisite extends Model
{
    protected $table = 'carnets_de_visite';

    protected $fillable = ['date_visite', 'compte_rendu', 'duree_visite', 'utilisateur_id', 'lieu_id'];

    public function utilisateur() { return $this->belongsTo(User::class, 'utilisateur_id'); }
    public function lieu() { return $this->belongsTo(Lieu::class); }
}
