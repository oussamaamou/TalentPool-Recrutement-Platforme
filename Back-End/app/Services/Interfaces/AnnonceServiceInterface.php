<?php

namespace App\Services\Interfaces;

use App\Models\Annonce;
use Illuminate\Database\Eloquent\Collection;

interface AnnonceServiceInterface
{
    public function getAllAnnonces(): Collection;
    public function getAnnonceById(int $id): ?Annonce;
    public function createAnnonce(array $data): Annonce;
    public function updateAnnonce(int $id, array $data): ?Annonce;
    public function deleteAnnonce(int $id): bool;
    public function getAnnoncesByRecruteur(int $recruteurId): Collection;
}