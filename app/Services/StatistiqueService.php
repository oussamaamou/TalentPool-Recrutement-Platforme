<?php

namespace App\Services;

use App\Models\Annonce;
use App\Models\Candidature;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class StatistiqueService
{
    public function getRecruteurStats(int $recruteurId): array
    {
        $annonceCount = Annonce::where('recruteur_id', $recruteurId)->count();
        
        $candidatureStats = Candidature::whereHas('annonce', function ($query) use ($recruteurId) {
            $query->where('recruteur_id', $recruteurId);
        })
        ->select('statut', DB::raw('count(*) as total'))
        ->groupBy('statut')
        ->get()
        ->pluck('total', 'statut')
        ->toArray();
        
        $candidatureByAnnonce = Candidature::whereHas('annonce', function ($query) use ($recruteurId) {
            $query->where('recruteur_id', $recruteurId);
        })
        ->join('annonces', 'candidatures.annonce_id', '=', 'annonces.id')
        ->select('annonces.title', DB::raw('count(*) as total'))
        ->groupBy('annonces.id', 'annonces.title')
        ->get()
        ->pluck('total', 'title')
        ->toArray();
        
        return [
            'annonce_count' => $annonceCount,
            'candidature_stats' => $candidatureStats,
            'candidatures_by_annonce' => $candidatureByAnnonce
        ];
    }
    
    public function getGlobalStats(): array
    {
        $usersByRole = User::select('role', DB::raw('count(*) as total'))
            ->groupBy('role')
            ->get()
            ->pluck('total', 'role')
            ->toArray();
            
        $annonceCount = Annonce::count();
        
        $candidatureCount = Candidature::count();
        
        $candidaturesByStatut = Candidature::select('statut', DB::raw('count(*) as total'))
            ->groupBy('statut')
            ->get()
            ->pluck('total', 'statut')
            ->toArray();
            
        $topRecruteurs = User::where('role', 'Recruteur')
            ->withCount('annonces')
            ->orderBy('annonces_count', 'desc')
            ->limit(5)
            ->get(['id', 'name', 'annonces_count'])
            ->toArray();
            
        return [
            'users_by_role' => $usersByRole,
            'annonce_count' => $annonceCount,
            'candidature_count' => $candidatureCount,
            'candidatures_by_statut' => $candidaturesByStatut,
            'top_recruteurs' => $topRecruteurs
        ];
    }
}