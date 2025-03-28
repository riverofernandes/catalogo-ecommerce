<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserAuthController;
use Illuminate\Support\Facades\Route;


Route::post('/login', [UserAuthController::class, 'login'])->name('login');
Route::post('/register', [UserAuthController::class, 'store']);
Route::post('/logout', [UserAuthController::class, 'logout']);

Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('user')->group(function () {
        Route::get('/', [UserAuthController::class, 'index']);
        Route::post('/update/{user}', [UserAuthController::class, 'update']);
        Route::post('/delete/{user}', [UserAuthController::class, 'destroy']);
    });
});


Route::prefix('products')->group(function () {
    Route::get('/', [ProductController::class, 'index']);
    Route::get('/{product}', [ProductController::class, 'show']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/store', [ProductController::class, 'store']);
        Route::post('/update/{product}', [ProductController::class, 'update']);
        Route::post('/delete/{product}', [ProductController::class, 'destroy']);
    });
});

Route::prefix('categories')->group(function () {
    Route::get('/', [CategoryController::class, 'index']);
    Route::get('/{category}', [CategoryController::class, 'show']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/store', [CategoryController::class, 'store']);
        Route::post('/update/{category}', [CategoryController::class, 'update']);
        Route::post('/delete/{category}', [CategoryController::class, 'destroy']);
    });
});
