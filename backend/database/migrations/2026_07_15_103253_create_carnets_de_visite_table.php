<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('carnets_de_visite', function (Blueprint $table) {
            $table->id();
            $table->date('date_visite');
            $table->text('compte_rendu');
            $table->integer('duree_visite'); // en minutes
            $table->foreignId('utilisateur_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('lieu_id')->constrained('lieux')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('carnets_de_visite');
    }
};
