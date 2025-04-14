<?php

namespace App\Http\Requests;

use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Http\FormRequest;

class UpdateCandidatureRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $candidature = $this->route('candidature'); 
        return $candidature && Auth::check() && $candidature->candidat_id === Auth::id();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'objet' => 'sometimes|required|string|max:255',
            'lettre' => 'sometimes|required|string',
            'document' => 'nullable|file|mimes:pdf,doc,docx|max:5120'
        ];
    }
}
