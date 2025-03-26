<?php

namespace App\Providers;

use App\Repositories\AnnonceRepository;
use App\Repositories\Interfaces\AnnonceRepositoryInterface;
use App\Services\AnnonceService;
use App\Services\Interfaces\AnnonceServiceInterface;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        // Binding des repositories
        $this->app->bind(AnnonceRepositoryInterface::class, AnnonceRepository::class);
        
        // Binding des services
        $this->app->bind(AnnonceServiceInterface::class, AnnonceService::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}