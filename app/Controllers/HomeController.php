<?php
namespace App\Controllers;

use App\Core\Controller;

final class HomeController extends Controller {
    public function index(): void {
        $this->view('home', ['pageTitle' => 'EcosiStem - Glossario Interattivo']);
    }

    // API demo per testare JS fetch
    public function ping(): void
    {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => true, 'time' => date('c')]);
    }
}

