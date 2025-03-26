<?php

namespace App\Services;

use App\Models\Candidature;
use App\Repositories\Interfaces\CandidatureRepositoryInterface;
use App\Services\Interfaces\CandidatureServiceInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class CandidatureService implements CandidatureServiceInterface
{
    protected $candidatureRepository;
    protected $notificationService;

    public function __construct(
        CandidatureRepositoryInterface $candidatureRepository,
        // NotificationService $notificationService
    ) {
        $this->candidatureRepository = $candidatureRepository;
        // $this->notificationService = $notificationService;
    }

    public function getAllCandidatures(): Collection
    {
        return $this->candidatureRepository->getAll();
    }

    public function getCandidatureById(int $id): ?Candidature
    {
        return $this->candidatureRepository->getById($id);
    }

    public function createCandidature(array $data, ?UploadedFile $document = null): Candidature
    {
        if ($document) {
            $path = $document->store('documents', 'public');
            $data['document'] = $path;
        }

        return $this->candidatureRepository->create($data);
    }

    public function updateCandidature(int $id, array $data, ?UploadedFile $document = null): ?Candidature
    {
        $candidature = $this->candidatureRepository->getById($id);
        
        if (!$candidature) {
            return null;
        }

        if ($document) {
            // Delete old document if exists
            if ($candidature->document) {
                Storage::disk('public')->delete($candidature->document);
            }
            
            $path = $document->store('documents', 'public');
            $data['document'] = $path;
        }

        return $this->candidatureRepository->update($id, $data);
    }

    public function deleteCandidature(int $id): bool
    {
        $candidature = $this->candidatureRepository->getById($id);
        
        if ($candidature && $candidature->document) {
            Storage::disk('public')->delete($candidature->document);
        }
        
        return $this->candidatureRepository->delete($id);
    }

    public function getCandidaturesByCandidat(int $candidatId): Collection
    {
        return $this->candidatureRepository->getByCandidat($candidatId);
    }

    public function getCandidaturesByAnnonce(int $annonceId): Collection
    {
        return $this->candidatureRepository->getByAnnonce($annonceId);
    }

    public function updateCandidatureStatut(int $id, string $statut): ?Candidature
    {
        $candidature = $this->candidatureRepository->updateStatut($id, $statut);
        
        if ($candidature) {
            // Send notification to the candidate
            $this->notificationService->notifyCandidatStatusChange(
                $candidature->candidat, 
                $candidature->annonce,
                $statut
            );
        }
        
        return $candidature;
    }

    public function getCandidaturesByRecruteur(int $recruteurId): Collection
    {
        return $this->candidatureRepository->getByRecruteurAnnonces($recruteurId);
    }
}