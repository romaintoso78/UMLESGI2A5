<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('utilisateur_badge', function (Blueprint $table) {
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('badge_id')->constrained('badges')->onDelete('cascade');
            $table->timestamp('obtenu_le')->useCurrent();
            $table->primary(['user_id', 'badge_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('utilisateur_badge');
    }
};
