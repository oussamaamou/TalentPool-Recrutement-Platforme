<?php

namespace App\Http\Controllers;

use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * Récupérer les détails de l'utilisateur connecté
     */
    public function profile(): JsonResponse
    {
        $user = Auth::user();
        return response()->json(['data' => $user]);
    }

    /**
     * Mettre à jour le profil de l'utilisateur connecté
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . Auth::id(),
            'password' => 'sometimes|required|string|min:8|confirmed'
        ]);
        
        $updatedUser = $this->userService->updateUser(Auth::id(), $data);
        
        return response()->json([
            'message' => 'Profil mis à jour avec succès',
            'data' => $updatedUser
        ]);
    }

    /**
     * Récupérer la liste des utilisateurs (réservé à l'administrateur)
     */
    public function index(): JsonResponse
    {
        // Vérification que l'utilisateur est un administrateur
        if (Auth::user()->role !== 'Admin') {
            return response()->json(['message' => 'Non autorisé'], 403);
        }
        
        $users = $this->userService->getAllUsers();
        return response()->json(['data' => $users]);
    }

    /**
     * Récupérer les détails d'un utilisateur (réservé à l'administrateur)
     */
    public function show(int $id): JsonResponse
    {

        if (Auth::user()->role !== 'Admin') {
            return response()->json(['message' => 'Non autorisé'], 403);
        }
        
        $user = $this->userService->getUserById($id);
        
        if (!$user) {
            return response()->json(['message' => 'Utilisateur non trouvé'], 404);
        }
        
        return response()->json(['data' => $user]);
    }

    /**
     * Supprimer un utilisateur (réservé à l'administrateur)
     */
    public function destroy(int $id): JsonResponse
    {
        if (Auth::user()->role !== 'Admin') {
            return response()->json(['message' => 'Non autorisé'], 403);
        }
        
        $result = $this->userService->deleteUser($id);
        
        if ($result) {
            return response()->json(['message' => 'Utilisateur supprimé avec succès']);
        }
        
        return response()->json(['message' => 'Échec de la suppression de l\'utilisateur'], 500);
    }
}