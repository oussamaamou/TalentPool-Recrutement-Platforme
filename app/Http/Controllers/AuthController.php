<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse 
    {

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'role' => 'required|string|max:255',
            'password' => 'required|string|min:8'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
            'password' => Hash::make($request->password)
        ]);

        $token = Auth::login($user);

        return response()->json([
            'status' => 'Success',
            'message' => 'User created successfully',
            'role' => $user->role,
            'user' => $user,
            'authorisation' => [
                'token' => $token,
                'type' => 'bearer',
            ]

        ], 201);

    }

    public function login(Request $request): JsonResponse 
    {

        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string'
        ]);

        $credentials = $request->only('email', 'password');

        $token = Auth::attempt($credentials);

        if(!$token){
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 401);
        }

        $user = Auth::user();

        return response()->json([
            'status' => 'Success',
            'message' => 'User connected successfully',
            'role' => $user->role,
            'user' => $user,
            'authorisation' => [
                'token' => $token,
                'type' => 'bearer',
            ]

        ], 200);
    }

    public function logout(): JsonResponse 
    {
        Auth::logout();
        return response()->json([
            'status' => 'Success',
            'message' => 'Successfully logged out'
        ]);
    }
}
