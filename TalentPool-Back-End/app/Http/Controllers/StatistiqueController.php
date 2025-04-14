<?php

namespace App\Http\Controllers;

use App\Services\StatistiqueService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class StatistiqueController extends Controller
{
    protected $statistiqueService;

    public function __construct(StatistiqueService $statistiqueService)
    {
        $this->statistiqueService = $statistiqueService;
    }

    public function getRecruteurStats(): JsonResponse
    {
        $stats = $this->statistiqueService->getRecruteurStats(Auth::id());
        return response()->json($stats);
    }

    public function getGlobalStats(): JsonResponse
    {
        $stats = $this->statistiqueService->getGlobalStats();
        return response()->json($stats);
    }
}
