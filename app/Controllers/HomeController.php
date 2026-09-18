<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\Controller;

final class HomeController extends Controller
{
    /**
     * Serve la Single Page Application React (EcosiSTEM).
     */
    public function index(): void
    {
        $distIndex = __DIR__ . '/../../public/dist/index.html';

        if (is_file($distIndex)) {
            // Se la build di produzione esiste, servila direttamente
            header('Content-Type: text/html; charset=utf-8');
            readfile($distIndex);
            exit;
        }

        // Altrimenti esegui il rendering della vista home di supporto
        $this->view('home', [
            'pageTitle' => 'EcosiSTEM - Portale Didattico STEM',
        ]);
    }
}
