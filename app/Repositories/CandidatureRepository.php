<?php

namespace App\Repositories;

use App\Models\Candidature;
use App\Repositories\Interfaces\CandidatureRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class CandidatureRepository implements CandidatureRepositoryInterface
{
    protected $model;

    public function __construct(Candidature $candidature)
    {
        $this->model = $candidature;
    }

    public function getAll(): Collection
    {
        return $this->model->all();
    }

    public function getById(int $id): ?Candidature
    {
        return $this->model->find($id);
    }

    public function create(array $data): Candidature
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): ?Candidature
    {
        $candidature = $this->getById($id);
        
        if (!$candidature) {
            return null;
        }
        
        $candidature->update($data);
        return $candidature;
    }

    public function delete(int $id): bool
    {
        $candidature = $this->getById($id);
        
        if (!$candidature) {
            return false;
        }
        
        return $candidature->delete();
    }

    public function getCandidaturesByAnnonce(int $annonceId): Collection
    {
        return $this->model->where('annonce_id', $annonceId)->get();
    }

    public function getCandidaturesByCandidat(int $candidatId): Collection
    {
        return $this->model->where('candidat_id', $candidatId)->get();
    }
}