<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('signalements', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['danger', 'lieu_detruit', 'lieu_squatte']);
            $table->text('description');
            $table->date('date_signalement');
            $table->enum('statut', ['ouvert', 'traite'])->default('ouvert');
            $table->foreignId('utilisateur_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('lieu_id')->constrained('lieux')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('signalements');
    }
};
