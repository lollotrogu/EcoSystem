<?php
declare(strict_types=1);

// Configurazione base errori
ini_set('display_errors', '0');
ini_set('log_errors', '1');
error_reporting(E_ALL);

// Autoload per classi App\*
spl_autoload_register(function (string $class): void {
    $prefix = 'App\\';
    $base = __DIR__ . '/../app/';
    if (str_starts_with($class, $prefix)) {
        $path = $base . str_replace('\\', '/', substr($class, strlen($prefix))) . '.php';
        if (is_file($path)) {
            require_once $path;
        }
    }
});

use App\Core\Security;
use App\Core\Router;
use App\Core\Response;
use App\Controllers\HomeController;
use App\Controllers\ApiController;

// Applica le intestazioni HTTP di sicurezza
Security::applyHeaders();

$router = new Router();

// =======================
// ROTTE WEB & SPA
// =======================
$router->get('/', [HomeController::class, 'index']);

// =======================
// ROTTE API REST
// =======================
$router->get('/api/ping', [ApiController::class, 'ping']);
$router->get('/api/health', [ApiController::class, 'health']);
$router->get('/api/glossario', [ApiController::class, 'glossario']);

// =======================
// =======================
// GESTIONE FALLBACK 404 & SPA
// =======================
$router->fallback(function (): void {
    $uri = $_SERVER['REQUEST_URI'] ?? '/';
    $path = parse_url($uri, PHP_URL_PATH) ?: '/';

    // 1. Se la richiesta è per un endpoint API, restituisci JSON 404
    if (str_starts_with($path, '/api/')) {
        Response::error('Endpoint API non trovato.', 404);
        return;
    }

    // 2. Se è una richiesta di asset statico (js, css, img, pdf, ecc.), servilo con il corretto MIME type
    if (preg_match('/\.(?:js|css|png|jpg|jpeg|gif|webp|svg|ico|pdf|json|woff2?|ttf|map)$/i', $path)) {
        $candidates = [
            __DIR__ . $path,
            __DIR__ . '/dist' . $path,
            __DIR__ . '/dist/assets/' . basename($path),
            __DIR__ . '/assets/' . basename($path),
        ];

        $mimeTypes = [
            'js' => 'application/javascript',
            'css' => 'text/css; charset=UTF-8',
            'json' => 'application/json; charset=UTF-8',
            'png' => 'image/png',
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'webp' => 'image/webp',
            'svg' => 'image/svg+xml',
            'ico' => 'image/x-icon',
            'pdf' => 'application/pdf',
        ];

        foreach ($candidates as $candidate) {
            if (is_file($candidate)) {
                $ext = strtolower(pathinfo($candidate, PATHINFO_EXTENSION));
                header('Content-Type: ' . ($mimeTypes[$ext] ?? 'application/octet-stream'));
                readfile($candidate);
                exit;
            }
        }

        http_response_code(404);
        exit;
    }

    // 3. Per richieste web SPA (navigazione), servi la Single Page Application React
    $distIndex = __DIR__ . '/dist/index.html';
    if (is_file($distIndex)) {
        header('Content-Type: text/html; charset=utf-8');
        readfile($distIndex);
        exit;
    }

    http_response_code(404);
    echo '<h1>404 - Risorsa non trovata</h1>';
});

// =======================
// DISPATCH DELLA RICHIESTA
// =======================
$router->dispatch(
    $_SERVER['REQUEST_METHOD'] ?? 'GET',
    $_SERVER['REQUEST_URI'] ?? '/'
);
