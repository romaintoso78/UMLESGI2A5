<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->renameColumn('name', 'pseudo');
            $table->enum('role', ['explorateur', 'moderateur'])->default('explorateur')->after('email');
            $table->integer('niveau_reputation')->default(0)->after('role');
            $table->text('bio')->nullable()->after('niveau_reputation');
            $table->date('date_inscription')->nullable()->after('bio');
            $table->date('date_nomination')->nullable()->after('date_inscription');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->renameColumn('pseudo', 'name');
            $table->dropColumn(['role', 'niveau_reputation', 'bio', 'date_inscription', 'date_nomination']);
        });
    }
};
