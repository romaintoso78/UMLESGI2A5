<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CarnetController;
use App\Http\Controllers\Api\CommentaireController;
use App\Http\Controllers\Api\GeocodeController;
use App\Http\Controllers\Api\LieuController;
use App\Http\Controllers\Api\ModerationController;
use App\Http\Controllers\Api\SignalementController;
use Illuminate\Support\Facades\Route;

// Routes publiques
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);
Route::get('/lieux',      [LieuController::class, 'index']);
Route::get('/lieux/{id}', [LieuController::class, 'show']);

// Routes protegees (Bearer token Sanctum)
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);

    Route::post('/lieux',       [LieuController::class, 'store']);
    Route::patch('/lieux/{id}', [LieuController::class, 'update']);

    Route::get('/lieux/{id}/carnets',  [CarnetController::class, 'index']);
    Route::post('/lieux/{id}/carnets', [CarnetController::class, 'store']);

    Route::post('/lieux/{id}/commentaires', [CommentaireController::class, 'store']);
    Route::post('/lieux/{id}/signalements', [SignalementController::class, 'store']);

    Route::post('/geocode', [GeocodeController::class, 'geocode']);

    // Routes moderateur uniquement
    Route::middleware('moderateur')->prefix('moderation')->group(function () {
        Route::get('/lieux-en-attente',   [ModerationController::class, 'lieuxEnAttente']);
        Route::patch('/lieux/{id}',        [ModerationController::class, 'validerLieu']);
        Route::get('/signalements',        [ModerationController::class, 'signalements']);
        Route::patch('/signalements/{id}', [ModerationController::class, 'traiterSignalement']);
    });
});
