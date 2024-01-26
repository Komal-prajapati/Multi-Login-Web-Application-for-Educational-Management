<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class TeachersRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return auth()->guard('admin')->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $passwordRule = 'required';
        $confirmPasswordRule = 'required';
        if ($this->isMethod('patch') || $this->isMethod('put')) {
            $passwordRule = 'nullable';
            $confirmPasswordRule = 'nullable';
        }

        return [
            'first_name' => 'required|max:255',
            'last_name' => 'required|max:255',
            'email' => 'required|email:filter|unique:teachers,email,'. $this->id,
            'track_id' => 'required|exists:tracks,id',
            'password' => $passwordRule,
            'confirm_password' => $confirmPasswordRule.'|same:password',
            'profile_picture' => 'nullable|image|mimes:jpg,jpeg,png,JPG,JPEG,PNG|max:1000',
            'is_active' => 'nullable',
            'contact_number' => 'nullable|numeric',
        ];
    }

    /**
     * The validation error messages.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'track_id.required' => 'The select track field is required.',
            'track_id.exists' => 'The selected trak does not exists.',
        ];
    }
}
