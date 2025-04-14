<?php

use App\Http\Controllers\AnnonceController;
use App\Http\Controllers\CandidatureController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ForgotPasswordController;
use App\Http\Controllers\StatistiqueController; 
use App\Http\Controllers\CategorieController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::get('/categories', [CategorieController::class, 'index']);
Route::get('/annonces', [AnnonceController::class, 'index']);
Route::get('/annonces/{id}', [AnnonceController::class, 'show']);

// Password reset routes
Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLinkEmail']);
Route::post('/reset-password', [ForgotPasswordController::class, 'reset']);


// Authentification routes
Route::middleware(['auth:api'])->group(function() {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});


// Administrateur routes
Route::middleware(['auth:api', 'role:Administrateur'])->group(function() {
    Route::get('/admin', function () {
        return response()->json(['message' => 'Welcome Admin']);
    });
    
    // Admin statistics
    Route::get('/stats/global', [StatistiqueController::class, 'getGlobalStats']);
    Route::post('/categories', [CategorieController::class, 'store']);
});


// Candidat routes
Route::middleware(['auth:api', 'role:Candidat'])->group(function() {
    Route::get('/dashboard', function () {
        return response()->json(['message' => 'Welcome Candidat']);
    });
    
    // Candidature routes
    Route::get('/candidatures', [CandidatureController::class, 'index']);
    Route::post('/candidatures', [CandidatureController::class, 'store']);
    Route::get('/candidatures/{id}', [CandidatureController::class, 'show']);
    Route::put('/candidatures/{candidature}', [CandidatureController::class, 'update']);
    Route::delete('/candidatures/{candidature}', [CandidatureController::class, 'destroy']);
});


// Recruteur routes
Route::middleware(['auth:api', 'role:Recruteur'])->group(function() {
    Route::get('/annonce', function () {
        return response()->json(['message' => 'Welcome Recruteur']);
    });
    
    // Annonce routes
    Route::post('/annonces', [AnnonceController::class, 'store']);
    Route::put('/annonces/{annonce}', [AnnonceController::class, 'update']);
    Route::delete('/annonces/{id}', [AnnonceController::class, 'destroy']);
    Route::get('/mes-annonces', [AnnonceController::class, 'mesAnnonces']);
    
    // Candidature management
    Route::put('/candidatures/{id}/statut', [CandidatureController::class, 'updateStatus']);
    Route::get('/candidatures/annonce/{annonceId}', [CandidatureController::class, 'getByAnnonce']);
    
    // Recruiter statistics
    Route::get('/stats/recruteur', [StatistiqueController::class, 'getRecruteurStats']);
});
