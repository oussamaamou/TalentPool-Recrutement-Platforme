<?php

use App\Http\Controllers\AnnonceController;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/annonces', [AnnonceController::class, 'index']);
Route::get('/annonces/{id}', [AnnonceController::class, 'show']);

Route::middleware(['auth:api'])->group(function(){
    Route::post('/logout', [AuthController::class, 'logout']);

});

Route::middleware(['auth:api', 'role:Administrateur'])->group(function(){

    Route::get('/admin', function () {
        return response()->json(['message' => 'Welcome Admin']);
    });

});

Route::middleware(['auth:api', 'role:Candidat'])->group(function(){
    
    Route::get('/dashboard', function () {
        return response()->json(['message' => 'Welcome Candidat']);
    });

});

Route::middleware(['auth:api', 'role:Recruteur'])->group(function(){

    Route::post('/annonces', [AnnonceController::class, 'store']);
    Route::put('/annonces/{id}', [AnnonceController::class, 'update']);
    Route::delete('/annonces/{id}', [AnnonceController::class, 'destroy']);
    Route::get('/mes-annonces', [AnnonceController::class, 'mesAnnonces']);
    
    Route::get('/annonce', function () {
        return response()->json(['message' => 'Welcome Recruteur']);
    });
});
