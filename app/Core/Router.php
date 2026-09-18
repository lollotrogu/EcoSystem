<?php
declare(strict_types=1);

namespace App\Core;

final class Router
{
    private array $routes = [
        'GET' => [],
        'POST' => [],
        'PUT' => [],
        'DELETE' => [],
        'OPTIONS' => [],
    ];

    private $fallback;

    public function get(string $path, callable|array $handler): self
    {
        $this->routes['GET'][$this->normalizePath($path)] = $handler;
        return $this;
    }

    public function post(string $path, callable|array $handler): self
    {
        $this->routes['POST'][$this->normalizePath($path)] = $handler;
        return $this;
    }

    public function fallback(callable $handler): self
    {
        $this->fallback = $handler;
        return $this;
    }

    private function normalizePath(string $path): string
    {
        $trimmed = '/' . trim($path, '/');
        return $trimmed === '' ? '/' : $trimmed;
    }

    public function dispatch(string $method, string $uri): void
    {
        $method = strtoupper($method);
        $path = parse_url($uri, PHP_URL_PATH) ?: '/';
        $normalizedPath = $this->normalizePath($path);

        // Risposta immediata a preflight CORS
        if ($method === 'OPTIONS') {
            http_response_code(204);
            Security::handleCors();
            exit;
        }

        // Verifica metodo consentito per il path (supporta anche HEAD per rotte GET)
        $handler = $this->routes[$method][$normalizedPath] ?? null;
        if (!$handler && $method === 'HEAD' && isset($this->routes['GET'][$normalizedPath])) {
            $handler = $this->routes['GET'][$normalizedPath];
        }

        if (!$handler) {
            // Controlla se la rotta esiste per un altro metodo HTTP (405 Method Not Allowed)
            $allowedMethods = [];
            foreach ($this->routes as $m => $routesByMethod) {
                if (isset($routesByMethod[$normalizedPath])) {
                    $allowedMethods[] = $m;
                }
            }

            if (!empty($allowedMethods)) {
                http_response_code(405);
                header('Allow: ' . implode(', ', $allowedMethods));
                if (str_starts_with($normalizedPath, '/api/')) {
                    Response::error('Metodo non consentito. Metodi consentiti: ' . implode(', ', $allowedMethods), 405);
                } else {
                    echo '405 - Metodo non consentito';
                }
                return;
            }

            // Fallback 404
            if ($this->fallback) {
                ($this->fallback)();
                return;
            }

            http_response_code(404);
            if (str_starts_with($normalizedPath, '/api/')) {
                Response::error('Risorsa non trovata', 404);
            } else {
                echo '404 - Pagina non trovata';
            }
            return;
        }

        // Esecuzione gestore
        try {
            if (is_array($handler)) {
                [$class, $fn] = $handler;
                if (!class_exists($class)) {
                    throw new \RuntimeException("Controller {$class} non trovato.");
                }
                $instance = new $class();
                if (!method_exists($instance, $fn)) {
                    throw new \RuntimeException("Metodo {$fn} non trovato in {$class}.");
                }
                $instance->$fn();
                return;
            }

            $handler();
        } catch (\Throwable $e) {
            error_log('[EcosiSTEM Server Error] ' . $e->getMessage() . "\n" . $e->getTraceAsString());

            http_response_code(500);
            if (str_starts_with($normalizedPath, '/api/')) {
                Response::error('Si è verificato un errore interno del server.', 500);
            } else {
                echo '<h1>500 - Errore interno del server</h1>';
            }
        }
    }
}
