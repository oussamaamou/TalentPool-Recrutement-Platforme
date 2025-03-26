<?php

namespace App\Services;

use App\Models\Annonce;
use App\Repositories\Interfaces\AnnonceRepositoryInterface;
use App\Services\Interfaces\AnnonceServiceInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AnnonceService implements AnnonceServiceInterface
{
    protected $annonceRepository;

    public function __construct(AnnonceRepositoryInterface $annonceRepository)
    {
        $this->annonceRepository = $annonceRepository;
    }

    public function getAllAnnonces(): Collection
    {
        return $this->annonceRepository->getAll();
    }

    public function getAnnonceById(int $id): ?Annonce
    {
        return $this->annonceRepository->getById($id);
    }

    public function createAnnonce(array $data): Annonce
    {

        $validator = Validator::make($data, [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'categorie_id' => 'required|exists:categories,id',
            'recruteur_id' => 'required|exists:users,id',
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        if (isset($data['thumbnail']) && $data['thumbnail']->isValid()) {
            $path = $data['thumbnail']->store('thumbnails', 'public');
            $data['thumbnail'] = $path;
        }

        return $this->annonceRepository->create($data);
    }

    public function updateAnnonce(int $id, array $data): ?Annonce
    {
        $annonce = $this->annonceRepository->getById($id);
        
        if (!$annonce) {
            return null;
        }
        
        $validator = Validator::make($data, [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'categorie_id' => 'sometimes|required|exists:categories,id',
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        if (isset($data['thumbnail']) && $data['thumbnail']->isValid()) {

            if ($annonce->thumbnail) {
                Storage::disk('public')->delete($annonce->thumbnail);
            }
            
            $path = $data['thumbnail']->store('thumbnails', 'public');
            $data['thumbnail'] = $path;
        }

        return $this->annonceRepository->update($id, $data);
    }

    public function deleteAnnonce(int $id): bool
    {
        $annonce = $this->annonceRepository->getById($id);
        
        if (!$annonce) {
            return false;
        }
        
        if ($annonce->thumbnail) {
            Storage::disk('public')->delete($annonce->thumbnail);
        }
        
        return $this->annonceRepository->delete($id);
    }

    public function getAnnoncesByRecruteur(int $recruteurId): Collection
    {
        return $this->annonceRepository->getByRecruteurId($recruteurId);
    }
}