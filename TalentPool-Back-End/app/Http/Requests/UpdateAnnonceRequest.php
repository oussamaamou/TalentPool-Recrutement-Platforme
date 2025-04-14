<?php

namespace App\Http\Requests;

use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Http\FormRequest;

class UpdateAnnonceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::check() && 
           Auth::user()->role === 'Recruteur' && 
           $this->route('annonce')->recruteur_id === Auth::id();
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'categorie_id' => 'sometimes|required|exists:categories,id',
            'thumbnail' => 'nullable|image|max:2048', 
        ];
    }
}