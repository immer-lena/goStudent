<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;

class AuthController extends Controller
{
    public function __construct(){
        $this->middleware('auth:api', ['except'=>['login']]);
    }

    public function login(){
        $credentials = request(['email', 'password']);
        if(!$token = auth()->attempt($credentials)){
            return response()->json(['error'=>'Unauthorized'], 401);
        }
        return $this->respondWithToken($token);
    }

    public function me(): JsonResponse
    {
        return response()->json(\auth()->user());
    }

    /**
     * Log the user out and invalid token
     */
    public function logout(){
        \auth()->logout();
        return response()->json(['message', 'Successfully logged out']);
    }


    protected function respondWithToken($token): JsonResponse
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => \auth()->factory()->getTTL()*60
        ]);
    }
}
