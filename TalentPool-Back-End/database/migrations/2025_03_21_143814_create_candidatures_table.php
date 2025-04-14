<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('candidatures', function (Blueprint $table) {
            $table->id();
            $table->string('objet');
            $table->text('lettre');
            $table->string('document')->nullable();
            $table->enum('statut',['En attente', 'Accepte', 'Refuse'])->default('En attente');
            $table->foreignId('annonce_id')->constrained('annonces')->onDelete('cascade'); 
            $table->foreignId('candidat_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('candidatures');
    }
};
