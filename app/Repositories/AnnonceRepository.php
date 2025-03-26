<?php

namespace App\Repositories;

use App\Models\Annonce;
use App\Repositories\Interfaces\AnnonceRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class AnnonceRepository implements AnnonceRepositoryInterface
{
    protected $model;

    public function __construct(Annonce $annonce)
    {
        $this->model = $annonce;
    }

    public function getAll(): Collection
    {
        return $this->model->all();
    }

    public function getById(int $id): ?Annonce
    {
        return $this->model->find($id);
    }

    public function create(array $data): Annonce
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): ?Annonce
    {
        $annonce = $this->getById($id);
        
        if (!$annonce) {
            return null;
        }
        
        $annonce->update($data);
        return $annonce;
    }

    public function delete(int $id): bool
    {
        $annonce = $this->getById($id);
        
        if (!$annonce) {
            return false;
        }
        
        return $annonce->delete();
    }

    public function getByRecruteurId(int $recruteurId): Collection
    {
        return $this->model->where('recruteur_id', $recruteurId)->get();
    }
}