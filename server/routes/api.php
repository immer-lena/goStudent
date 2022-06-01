<?php

use App\Http\Controllers\AdController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

//Ads
Route::get('/ads', [AdController::class, 'index']);
Route::get('/ads/{ad}', [AdController::class, 'find_ad_by_id']);
Route::get('/user/{user}/ads', [AdController::class, 'find_ads_for_user']);
Route::get('/user/{id}/ads/{state}', [AdController::class, 'find_INactive_ads_for_user']);
Route::get('/courses/{course}/ads', [AdController::class, 'find_ads_for_course']);
Route::get('/studies/{study}/ads', [AdController::class, 'find_ads_for_study']);

//User
Route::get('/user',[UserController::class, 'index']);
Route::get('/user/{id}', [UserController::class, 'getSingle']);
Route::get('/meeting_dates/requested', [UserController::class, 'get_requested_meeting_dates']);
Route::post('/user', [UserController::class, 'register']);

//Courses
Route::get('/courses',[UserController::class, 'courses']);
Route::get('/courses/{id}', [UserController::class, 'course']);
Route::get('/studies/{id}/courses', [UserController::class, 'course_of_study']);

//Studies
Route::get('/studies',[UserController::class, 'studies']);
Route::get('/studies/{id}',[UserController::class, 'study']);

//Meeting Dates
Route::get('/meeting_dates', [AdController::class, 'meeting_dates']);
Route::get('/meeting_dates/{meeting_date}', [AdController::class, 'get_single_meeting_date']);
Route::get('/ads/{ad}/meeting_dates', [AdController::class, 'get_meeting_dates_of_ad']);
Route::get('/meeting_dates/sent_requests/{id}/{state}', [AdController::class, 'get_sent_request_for_user']);
Route::get('/meeting_dates/open_requests/{id}', [AdController::class, 'has_open_requests']);

//Login
Route::post('auth/login', [AuthController::class, 'login']);

//Admin rights
Route::group(['middleware' => ['api', 'auth.jwt']], function (){
    //ADS
    Route::post('ads', [AdController::class, 'create_ad']);
    Route::put('ads/{ad}', [AdController::class, 'update_ad']);
    Route::delete('ads/{ad}', [AdController::class, 'delete_ad']);
    //User
    Route::put('/user/{id}/admin/', [UserController::class, 'updateUser']);
    //Meeting_Dates
    Route::post('/meeting_dates', [AdController::class, 'create_meeting_date']);
    Route::put('/meeting_dates/{meeting_date}',
        [AdController::class, 'update_meeting_date']);
    Route::delete('/meeting_dates/{meeting_date}',
        [AdController::class, 'delete_meeting_date']);
    Route::post('auth/logout', [AuthController::class, 'logout']);
});
