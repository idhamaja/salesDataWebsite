<?php

use App\Http\Controllers\API\BarangController;
use Illuminate\Support\Facades\Route;


Route::get('/barangs', [BarangController::class, 'index']);
Route::post('/barangs', [BarangController::class, 'store']);
Route::put('/barangs/{id}', [BarangController::class, 'update']);
Route::delete('/barangs/{id}', [BarangController::class, 'destroy']);
