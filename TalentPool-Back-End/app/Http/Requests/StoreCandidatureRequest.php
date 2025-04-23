<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreCandidatureRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::check() && Auth::user()->role === 'Candidat';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'objet' => 'required|string|max:255',
            'lettre' => 'required|string',
            'annonce_id' => 'required|exists:annonces,id',
            'document' => 'nullable|file|mimes:pdf,doc,docx|max:5120' // 5MB max
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'document.file' => 'Le document doit être un fichier.',
            'document.mimes' => 'Le document doit être un fichier de type: pdf, doc, docx.',
            'document.max' => 'La taille du document ne doit pas dépasser 5 Mo.',
        ];
    }
}