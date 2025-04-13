<?php

namespace App\Services;

use App\Models\Candidature;
use App\Repositories\Interfaces\CandidatureRepositoryInterface;
use App\Services\Interfaces\CandidatureServiceInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Storage;

class CandidatureService implements CandidatureServiceInterface
{
    protected $candidatureRepository;

    public function __construct(CandidatureRepositoryInterface $candidatureRepository)
    {
        $this->candidatureRepository = $candidatureRepository;
    }

    public function getAllCandidatures(): Collection
    {
        return $this->candidatureRepository->getAll();
    }

    public function getCandidatureById(int $id): ?Candidature
    {
        return $this->candidatureRepository->getById($id);
    }

    public function createCandidature(array $data): Candidature
    {
        $validator = Validator::make($data, [
            'objet' => 'required|string|max:255',
            'lettre' => 'required|string',
            'annonce_id' => 'required|exists:annonces,id',
            'candidat_id' => 'required|exists:users,id',
            'document' => 'nullable|file|mimes:pdf,doc,docx|max:5120'
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        if (isset($data['document']) && $data['document']->isValid()) {
            $path = $data['document']->store('candidatures', 'public');
            $data['document'] = $path;
        }

        return $this->candidatureRepository->create($data);
    }

    public function updateCandidature(int $id, array $data): ?Candidature
    {
        $validator = Validator::make($data, [
            'objet' => 'sometimes|required|string|max:255',
            'lettre' => 'sometimes|required|string',
            'document' => 'nullable|file|mimes:pdf,doc,docx|max:5120'
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        $candidature = $this->candidatureRepository->getById($id);
        
        if (!$candidature) {
            return null;
        }

        if (isset($data['document']) && $data['document']->isValid()) {

            if ($candidature->document) {
                Storage::disk('public')->delete($candidature->document);
            }
            
            $path = $data['document']->store('candidatures', 'public');
            $data['document'] = $path;
        }

        return $this->candidatureRepository->update($id, $data);
    }

    public function deleteCandidature(int $id): bool
    {
        $candidature = $this->candidatureRepository->getById($id);
        
        if (!$candidature) {
            return false;
        }
        
        if ($candidature->document) {
            Storage::disk('public')->delete($candidature->document);
        }
        
        return $this->candidatureRepository->delete($id);
    }

    public function getCandidaturesByAnnonce(int $annonceId): Collection
    {
        return $this->candidatureRepository->getCandidaturesByAnnonce($annonceId);
    }

    public function getCandidaturesByCandidat(int $candidatId): Collection
    {
        return $this->candidatureRepository->getCandidaturesByCandidat($candidatId);
    }

    public function updateCandidatureStatus(int $id, string $statut): ?Candidature
    {
        $validator = Validator::make(['statut' => $statut], [
            'statut' => 'required|in:En attente,Accepte,Refuse'
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        return $this->candidatureRepository->update($id, ['statut' => $statut]);
    }
}