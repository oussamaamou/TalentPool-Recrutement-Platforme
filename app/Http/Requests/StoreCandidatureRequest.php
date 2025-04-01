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
            'document' => 'nullable|file|mimes:pdf,doc,docx|max:5120'
        ];
    }
}
