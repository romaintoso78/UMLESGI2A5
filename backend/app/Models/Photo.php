<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Photo extends Model
{
    protected $fillable = ['url', 'date_upload', 'legende', 'lieu_id'];

    public function lieu() { return $this->belongsTo(Lieu::class); }
}
