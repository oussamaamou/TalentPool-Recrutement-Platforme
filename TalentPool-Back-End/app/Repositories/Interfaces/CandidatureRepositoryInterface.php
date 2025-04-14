<?php

namespace App\Repositories\Interfaces;

use App\Models\Candidature;
use Illuminate\Database\Eloquent\Collection;

interface CandidatureRepositoryInterface
{
    public function getAll(): Collection;
    public function getById(int $id): ?Candidature;
    public function create(array $data): Candidature;
    public function update(int $id, array $data): ?Candidature;
    public function delete(int $id): bool;
    public function getCandidaturesByAnnonce(int $annonceId): Collection;
    public function getCandidaturesByCandidat(int $candidatId): Collection;
}