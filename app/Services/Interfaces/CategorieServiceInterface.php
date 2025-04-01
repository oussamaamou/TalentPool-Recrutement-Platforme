<?php

namespace App\Services\Interfaces;

use App\Models\Categorie;
use Illuminate\Database\Eloquent\Collection;

interface CategorieServiceInterface
{
    public function getAllCategories(): Collection;
    public function getCategorieById(int $id): ?Categorie;
    public function createCategorie(array $data): Categorie;
    public function updateCategorie(int $id, array $data): ?Categorie;
    public function deleteCategorie(int $id): bool;
}