<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Commentaire extends Model
{
    protected $fillable = ['contenu', 'date_creation', 'note', 'utilisateur_id', 'lieu_id'];

    public function utilisateur() { return $this->belongsTo(User::class, 'utilisateur_id'); }
    public function lieu() { return $this->belongsTo(Lieu::class); }
}
