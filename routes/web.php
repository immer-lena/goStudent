<?php

use App\Http\Controllers\AdController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [AdController::class, 'index']);

Route::get('/ads', [AdController::class, 'index']);
Route::get('/ads/{ad}', [AdController::class, 'show']);


Route::get('/login', function () {
    return view('login');
});

Route::get('/profile',[UserController::class, 'index']);

Route::get('/courses',[UserController::class, 'courses']);

Route::get('/studies',[UserController::class, 'studies']);

Route::get('/meeting_dates', [AdController::class, 'meeting_dates']);
