<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCandidatureRequest;
use App\Http\Requests\UpdateCandidatureRequest;
use App\Models\User;
use App\Models\Candidature;
use App\Notifications\CandidatureStatusNotification;
use App\Services\Interfaces\CandidatureServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class CandidatureController extends Controller
{
    protected $candidatureService;

    public function __construct(CandidatureServiceInterface $candidatureService)
    {
        $this->candidatureService = $candidatureService;
    }

    public function index(Request $request): JsonResponse
    {
        $user = Auth::user();
        
        if ($user->role === 'Recruteur') {
            
            $candidatures = collect();
            $user->annonces->each(function ($annonce) use ($candidatures) {
                $candidatures = $candidatures->merge($annonce->candidatures);
            });
            return response()->json(['data' => $candidatures]);
        } elseif ($user->role === 'Candidat') {
            
            $candidatures = $this->candidatureService->getCandidaturesByCandidat($user->id);
            return response()->json(['data' => $candidatures]);
        }
        
        return response()->json(['message' => 'Non autorisé'], 403);
    }

    public function show(int $id): JsonResponse
    {
        $candidature = $this->candidatureService->getCandidatureById($id);
        
        if (!$candidature) {
            return response()->json(['message' => 'Candidature non trouvée'], 404);
        }
        
        $user = Auth::user();
        if ($user->role === 'Recruteur' && $candidature->annonce->recruteur_id !== $user->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }
        
        if ($user->role === 'Candidat' && $candidature->candidat_id !== $user->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }
        
        return response()->json(['data' => $candidature]);
    }

    public function store(StoreCandidatureRequest $request): JsonResponse
    {
        $data = $request->validated();
        
        $data['candidat_id'] = Auth::id();
        
        
        try {
            $candidature = $this->candidatureService->createCandidature($data);
            
            return response()->json([
                'message' => 'Candidature créée avec succès',
                'data' => $candidature
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Échec de la création de la candidature',
                'errors' => ['document' => [$e->getMessage()]]
            ], 422);
        }
    }

    public function update(UpdateCandidatureRequest $request, Candidature $candidature): JsonResponse
    {
        if ($candidature->candidat_id !== Auth::id()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }
        
        try {
            $updatedCandidature = $this->candidatureService->updateCandidature(
                $candidature->id, 
                $request->validated()
            );
            
            return response()->json([
                'message' => 'Candidature mise à jour avec succès',
                'data' => $updatedCandidature
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Échec de la mise à jour de la candidature',
                'errors' => ['document' => [$e->getMessage()]]
            ], 422);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        $candidature = $this->candidatureService->getCandidatureById($id);
        
        if (!$candidature) {
            return response()->json(['message' => 'Candidature non trouvée'], 404);
        }
        
        if ($candidature->candidat_id !== Auth::id()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }
        
        $result = $this->candidatureService->deleteCandidature($id);
        
        if ($result) {
            return response()->json(['message' => 'Candidature supprimée avec succès']);
        }
        
        return response()->json(['message' => 'Échec de la suppression de la candidature'], 500);
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'statut' => 'required|in:En attente,Accepte,Refuse'
        ]);
        
        $candidature = $this->candidatureService->getCandidatureById($id);
        
        if (!$candidature) {
            return response()->json(['message' => 'Candidature non trouvée'], 404);
        }
        
        $user = Auth::user();
        if ($user->role !== 'Recruteur' || $candidature->annonce->recruteur_id !== $user->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }
        
        $oldStatus = $candidature->statut;
        $updatedCandidature = $this->candidatureService->updateCandidatureStatus($id, $data['statut']);
        
        if ($oldStatus !== $data['statut']) {
            $candidat = User::find($candidature->candidat_id);
            $candidat->notify(new CandidatureStatusNotification($updatedCandidature, $data['statut']));
        }
        
        return response()->json([
            'message' => 'Statut de la candidature mis à jour avec succès',
            'data' => $updatedCandidature
        ]);
    }

    public function getByCandidat(): JsonResponse
    {
        $candidatures = $this->candidatureService->getCandidaturesByCandidat(Auth::id());
        return response()->json($candidatures);
    }

    public function getByAnnonce(int $annonceId): JsonResponse
    {
        $candidatures = $this->candidatureService->getCandidaturesByAnnonce($annonceId);
        return response()->json($candidatures);
    }
}