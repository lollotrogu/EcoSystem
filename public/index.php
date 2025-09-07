<?php
declare(strict_types=1);

require_once __DIR__ . '/../app/Core/Router.php';
require_once __DIR__ . '/../app/Core/Controller.php';

// autoload semplice per app/*
spl_autoload_register(function($class){
    $prefix = 'App\\';
    $base = __DIR__ . '/../app/';
    if (str_starts_with($class, $prefix)) {
        $path = $base . str_replace('\\', '/', substr($class, strlen($prefix))) . '.php';
        if (is_file($path)) require $path;
    }
});

use App\Core\Router;
use App\Controllers\HomeController;

$router = new Router();

// Rotte
$router->get('/', [HomeController::class, 'index']);

// 404 di default
$router->fallback(function(){
    http_response_code(404);
    echo 'Pagina non trovata';
});

// Dispatch
$router->dispatch($_SERVER['REQUEST_METHOD'] ?? 'GET', $_SERVER['REQUEST_URI'] ?? '/');
