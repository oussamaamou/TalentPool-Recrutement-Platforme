<?php

namespace App\Repositories\Interfaces;

use App\Models\Categorie;
use Illuminate\Database\Eloquent\Collection;

interface CategorieRepositoryInterface
{
    public function getAll(): Collection;
    public function getById(int $id): ?Categorie;
    public function create(array $data): Categorie;
    public function update(int $id, array $data): ?Categorie;
    public function delete(int $id): bool;
    public function getByName(string $name): ?Categorie;
}