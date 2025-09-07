<?php
namespace App\Controllers;

use App\Core\Controller;

final class HomeController extends Controller {
    public function index(): void {
        $this->view('home', ['pageTitle' => 'EcosiStem - Glossario Interattivo']);
    }
}
