<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Signalement extends Model
{
    protected $fillable = ['type', 'description', 'date_signalement', 'statut', 'utilisateur_id', 'lieu_id'];

    public function utilisateur() { return $this->belongsTo(User::class, 'utilisateur_id'); }
    public function lieu() { return $this->belongsTo(Lieu::class); }
}
