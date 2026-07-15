<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lieux', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->text('description');
            $table->float('latitude', 10, 6);
            $table->float('longitude', 10, 6);
            $table->enum('niveau_risque', ['faible', 'moyen', 'eleve'])->default('faible');
            $table->enum('statut', ['en_attente', 'valide', 'rejete'])->default('en_attente');
            $table->date('date_creation');
            $table->foreignId('utilisateur_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lieux');
    }
};
