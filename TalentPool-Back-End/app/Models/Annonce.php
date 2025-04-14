<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Categorie;
use App\Models\User;
use App\Models\Candidature;

class Annonce extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'thumbnail',
        'categorie_id',
        'recruteur_id'
    ];

    public function categorie()
    {
        return $this->belongsTo(Categorie::class);
    }

    public function recruteur()
    {
        return $this->belongsTo(User::class, 'recruteur_id');
    }

    public function candidatures()
    {
        return $this->hasMany(Candidature::class);
    }
}