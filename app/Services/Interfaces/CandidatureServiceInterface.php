<?php 

namespace App\Services\Interfaces;

use App\Models\Candidature;
use Illuminate\Database\Eloquent\Collection;

interface CandidatureRepositoryInterface
{
    public function getAllCandidatures(): Collection;
    public function getCandidatureById(int $id): ?Candidature;
    public function createCandidature(array $data): Candidature;
    public function updateCandidature(int $id, array $data): ?Candidature;
    public function deleteCandidature(int $id): bool;
    public function getCandidaturesByCandidat(int $candidatId): Collection;
    public function getCandidaturesByAnnonce(int $annonceId): Collection;
    public function updateCandidatureStatut(int $id, string $statut): ?Candidature;
    public function getCandidaturesByRecruteurAnnonces(int $recruteurId): Collection;
}