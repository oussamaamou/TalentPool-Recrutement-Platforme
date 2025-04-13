<?php

namespace App\Services;

use App\Models\Categorie;
use App\Repositories\Interfaces\CategorieRepositoryInterface;
use App\Services\Interfaces\CategorieServiceInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class CategorieService implements CategorieServiceInterface
{
    protected $categorieRepository;

    public function __construct(CategorieRepositoryInterface $categorieRepository)
    {
        $this->categorieRepository = $categorieRepository;
    }

    public function getAllCategories(): Collection
    {
        return $this->categorieRepository->getAll();
    }

    public function getCategorieById(int $id): ?Categorie
    {
        return $this->categorieRepository->getById($id);
    }

    public function createCategorie(array $data): Categorie
    {
        $validator = Validator::make($data, [
            'name' => 'required|string|unique:categories,name|max:255'
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        return $this->categorieRepository->create($data);
    }

    public function updateCategorie(int $id, array $data): ?Categorie
    {
        $validator = Validator::make($data, [
            'name' => 'required|string|unique:categories,name,'.$id.'|max:255'
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        return $this->categorieRepository->update($id, $data);
    }

    public function deleteCategorie(int $id): bool
    {
        return $this->categorieRepository->delete($id);
    }
}