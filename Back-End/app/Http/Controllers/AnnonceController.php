<?php

namespace App\Http\Controllers;

use App\Services\Interfaces\AnnonceServiceInterface;
use App\Models\Annonce;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StoreAnnonceRequest;
use App\Http\Requests\UpdateAnnonceRequest;

class AnnonceController extends Controller
{
    protected $annonceService;

    public function __construct(AnnonceServiceInterface $annonceService)
    {
        $this->annonceService = $annonceService;
    }

    /**
     * Récupérer toutes les annonces
     */
    public function index(): JsonResponse
    {
        $annonces = $this->annonceService->getAllAnnonces();
        return response()->json(['data' => $annonces]);
    }

    /**
     * Récupérer une annonce spécifique
     */
    public function show(int $id): JsonResponse
    {
        $annonce = $this->annonceService->getAnnonceById($id);
        
        if (!$annonce) {
            return response()->json(['message' => 'Annonce non trouvée'], 404);
        }
        
        return response()->json(['data' => $annonce]);
    }

    /**
     * Créer une nouvelle annonce (réservé aux recruteurs)
     */
    public function store(StoreAnnonceRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['recruteur_id'] = Auth::id();
        
        $annonce = $this->annonceService->createAnnonce($data);
        
        return response()->json([
            'message' => 'Annonce créée avec succès',
            'data' => $annonce
        ], 201);
    }

    /**
     * Mettre à jour une annonce existante (réservé aux recruteurs)
     */
    public function update(UpdateAnnonceRequest $request, Annonce $annonce): JsonResponse
    {
        $updatedAnnonce = $this->annonceService->updateAnnonce($annonce->id, $request->validated());
        
        return response()->json([
            'message' => 'Annonce mise à jour avec succès',
            'data' => $updatedAnnonce
        ]);
    }   

    /**
     * Supprimer une annonce (réservé aux recruteurs)
     */
    public function destroy(int $id): JsonResponse
    {

        $annonce = $this->annonceService->getAnnonceById($id);
        
        if (!$annonce) {
            return response()->json(['message' => 'Annonce non trouvée'], 404);
        }
        
        if ($annonce->recruteur_id !== Auth::id()) {
            return response()->json(['message' => 'Non autorisé à supprimer cette annonce'], 403);
        }
        
        $result = $this->annonceService->deleteAnnonce($id);
        
        if ($result) {
            return response()->json(['message' => 'Annonce supprimée avec succès']);
        }
        
        return response()->json(['message' => 'Échec de la suppression de l\'annonce'], 500);
    }

    /**
     * Récupérer les annonces du recruteur connecté
     */
    public function mesAnnonces(): JsonResponse
    {
        $annonces = $this->annonceService->getAnnoncesByRecruteur(Auth::id());
        return response()->json(['data' => $annonces]);
    }
}