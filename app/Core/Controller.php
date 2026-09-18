<?php
declare(strict_types=1);

namespace App\Core;

abstract class Controller
{
    /**
     * Esegue il rendering di una vista PHP con passaggio sicuro dei dati.
     */
    protected function view(string $name, array $data = []): void
    {
        extract($data, EXTR_SKIP);
        $viewPath = __DIR__ . '/../Views/' . $name . '.php';

        if (!is_file($viewPath)) {
            throw new \RuntimeException("Vista '{$name}' non trovata in {$viewPath}.");
        }

        require $viewPath;
    }

    /**
     * Invia una risposta JSON.
     */
    protected function json(mixed $data, int $status = 200, array $headers = []): void
    {
        Response::json($data, $status, $headers);
    }

    /**
     * Invia una risposta di errore in JSON.
     */
    protected function error(string $message, int $status = 400, array $details = []): void
    {
        Response::error($message, $status, $details);
    }
}
