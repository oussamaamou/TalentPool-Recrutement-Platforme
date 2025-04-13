<?php

namespace App\Providers;

use App\Repositories\AnnonceRepository;
use App\Repositories\Interfaces\AnnonceRepositoryInterface;
use App\Services\AnnonceService;
use App\Services\Interfaces\AnnonceServiceInterface;

use App\Repositories\Interfaces\CandidatureRepositoryInterface;
use App\Repositories\CandidatureRepository;
use App\Services\Interfaces\CandidatureServiceInterface;
use App\Services\CandidatureService;

use App\Repositories\Interfaces\CategorieRepositoryInterface;
use App\Repositories\CategorieRepository;
use App\Services\Interfaces\CategorieServiceInterface;
use App\Services\CategorieService;

use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        // Annonces
        $this->app->bind(AnnonceRepositoryInterface::class, AnnonceRepository::class);
        $this->app->bind(AnnonceServiceInterface::class, AnnonceService::class);

        // Candidatures
        $this->app->bind(CandidatureRepositoryInterface::class, CandidatureRepository::class);
        $this->app->bind(CandidatureServiceInterface::class, CandidatureService::class);

        // Categorie
        $this->app->bind(CategorieRepositoryInterface::class, CategorieRepository::class);
        $this->app->bind(CategorieServiceInterface::class, CategorieService::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}