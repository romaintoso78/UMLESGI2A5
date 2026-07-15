<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Badge extends Model
{
    protected $fillable = ['nom', 'seuil_reputation', 'icone'];

    public function utilisateurs() { return $this->belongsToMany(User::class, 'utilisateur_badge', 'badge_id', 'user_id')->withPivot('obtenu_le'); }
}
