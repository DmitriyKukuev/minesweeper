<?php

namespace App\Http\Controllers;

use Illuminate\View\View;

/**
 * Возвращает вьюху с одним дивом app для рендера Vue
 */
class IndexController extends Controller
{
    public function __invoke(): View
    {
        return view('index');
    }
}
