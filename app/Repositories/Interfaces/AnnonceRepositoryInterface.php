<?php

namespace App\Repositories\Interfaces;

use App\Models\Annonce;
use Illuminate\Database\Eloquent\Collection;

interface AnnonceRepositoryInterface
{
    public function getAll(): Collection;
    public function getById(int $id): ?Annonce;
    public function create(array $data): Annonce;
    public function update(int $id, array $data): ?Annonce;
    public function delete(int $id): bool;
    public function getByRecruteurId(int $recruteurId): Collection;
}