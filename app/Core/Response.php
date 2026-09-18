<?php
declare(strict_types=1);

namespace App\Core;

final class Response
{
    /**
     * Invia una risposta JSON sicura con intestazioni corrette.
     */
    public static function json(mixed $data, int $status = 200, array $headers = []): void
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');

        foreach ($headers as $name => $value) {
            header("{$name}: {$value}");
        }

        if (strtoupper($_SERVER['REQUEST_METHOD'] ?? '') !== 'HEAD') {
            echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        }
        exit;
    }

    /**
     * Invia una risposta di errore standardizzata in formato JSON.
     */
    public static function error(string $message, int $status = 400, array $details = []): void
    {
        $payload = [
            'success' => false,
            'error' => $message,
            'status' => $status,
        ];
        if (!empty($details)) {
            $payload['details'] = $details;
        }

        self::json($payload, $status);
    }

    /**
     * Invia una risposta HTML con charset UTF-8.
     */
    public static function html(string $html, int $status = 200, array $headers = []): void
    {
        http_response_code($status);
        header('Content-Type: text/html; charset=utf-8');

        foreach ($headers as $name => $value) {
            header("{$name}: {$value}");
        }

        echo $html;
        exit;
    }
}

