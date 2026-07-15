<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'pseudo', 'email', 'password', 'role',
        'niveau_reputation', 'bio', 'date_inscription', 'date_nomination',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function lieux() { return $this->hasMany(Lieu::class, 'utilisateur_id'); }
    public function carnets() { return $this->hasMany(CarnetDeVisite::class, 'utilisateur_id'); }
    public function commentaires() { return $this->hasMany(Commentaire::class, 'utilisateur_id'); }
    public function signalements() { return $this->hasMany(Signalement::class, 'utilisateur_id'); }
    public function badges() { return $this->belongsToMany(Badge::class, 'utilisateur_badge', 'user_id', 'badge_id')->withPivot('obtenu_le'); }

    // Incrémente la réputation et attribue les badges débloqués
    public function gagnerReputation(int $points): void
    {
        $this->increment('niveau_reputation', $points);
        $this->refresh();

        $badgesDebloques = Badge::where('seuil_reputation', '<=', $this->niveau_reputation)
            ->whereNotIn('id', $this->badges->pluck('id'))
            ->get();

        foreach ($badgesDebloques as $badge) {
            $this->badges()->attach($badge->id);
        }
    }

    public function estModerateur(): bool
    {
        return $this->role === 'moderateur';
    }
}
