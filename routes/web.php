<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers as Con;

// Vue
Route::get('{index}', Con\IndexController::class)
    ->where('index', '.*')
    ->name('index');
