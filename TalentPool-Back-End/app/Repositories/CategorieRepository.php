<?php

namespace App\Repositories;

use App\Models\Categorie;
use App\Repositories\Interfaces\CategorieRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class CategorieRepository implements CategorieRepositoryInterface
{
    protected $model;

    public function __construct(Categorie $categorie)
    {
        $this->model = $categorie;
    }

    public function getAll(): Collection
    {
        return $this->model->all();
    }

    public function getById(int $id): ?Categorie
    {
        return $this->model->find($id);
    }

    public function create(array $data): Categorie
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): ?Categorie
    {
        $categorie = $this->getById($id);
        
        if (!$categorie) {
            return null;
        }
        
        $categorie->update($data);
        return $categorie;
    }

    public function delete(int $id): bool
    {
        $categorie = $this->getById($id);
        
        if (!$categorie) {
            return false;
        }
        
        return $categorie->delete();
    }

    public function getByName(string $name): ?Categorie
    {
        return $this->model->where('name', $name)->first();
    }
}