<?php

namespace App\Http\Controllers;

use App\Services\Interfaces\CategorieServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategorieController extends Controller
{
    protected $categorieService;

    public function __construct(CategorieServiceInterface $categorieService)
    {
        $this->categorieService = $categorieService;
    }

    public function index(): JsonResponse
    {
        $categories = $this->categorieService->getAllCategories();
        return response()->json(['data' => $categories]);
    }

    public function show(int $id): JsonResponse
    {
        $categorie = $this->categorieService->getCategorieById($id);
        
        if (!$categorie) {
            return response()->json(['message' => 'Catégorie non trouvée'], 404);
        }
        
        return response()->json(['data' => $categorie]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|unique:categories,name|max:255'
        ]);
        
        $categorie = $this->categorieService->createCategorie($data);
        
        return response()->json([
            'message' => 'Catégorie créée avec succès',
            'data' => $categorie
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|unique:categories,name,'.$id.'|max:255'
        ]);
        
        $updatedCategorie = $this->categorieService->updateCategorie($id, $data);
        
        return response()->json([
            'message' => 'Catégorie mise à jour avec succès',
            'data' => $updatedCategorie
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $result = $this->categorieService->deleteCategorie($id);
        
        if ($result) {
            return response()->json(['message' => 'Catégorie supprimée avec succès']);
        }
        
        return response()->json(['message' => 'Échec de la suppression de la catégorie'], 500);
    }
}