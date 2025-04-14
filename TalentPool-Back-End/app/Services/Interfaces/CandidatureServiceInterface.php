<?php

namespace App\Services\Interfaces;

use App\Models\Candidature;
use Illuminate\Database\Eloquent\Collection;

interface CandidatureServiceInterface
{
    public function getAllCandidatures(): Collection;
    public function getCandidatureById(int $id): ?Candidature;
    public function createCandidature(array $data): Candidature;
    public function updateCandidature(int $id, array $data): ?Candidature;
    public function deleteCandidature(int $id): bool;
    public function getCandidaturesByAnnonce(int $annonceId): Collection;
    public function getCandidaturesByCandidat(int $candidatId): Collection;
    public function updateCandidatureStatus(int $id, string $statut): ?Candidature;
}