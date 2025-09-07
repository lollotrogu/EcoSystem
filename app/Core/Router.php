<?php
namespace App\Core;

final class Router {
    private array $routes = ['GET'=>[], 'POST'=>[], 'PUT'=>[], 'DELETE'=>[]];
    private $fallback;

    public function get(string $path, callable|array $handler){ $this->routes['GET'][$path] = $handler; }
    public function post(string $path, callable|array $handler){ $this->routes['POST'][$path] = $handler; }
    public function fallback(callable $handler){ $this->fallback = $handler; }

    public function dispatch(string $method, string $uri): void {
        $path = parse_url($uri, PHP_URL_PATH) ?: '/';
        $handler = $this->routes[$method][$path] ?? null;
        if (!$handler) { ($this->fallback)(); return; }
        if (is_array($handler)) {
            [$class, $fn] = $handler; (new $class)->$fn(); return;
        }
        $handler();
    }
}
