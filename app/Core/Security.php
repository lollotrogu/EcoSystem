<?php
declare(strict_types=1);

namespace App\Core;

final class Security
{
    /**
     * Applica le intestazioni HTTP di sicurezza raccomandate.
     */
    public static function applyHeaders(): void
    {
        if (headers_sent()) {
            return;
        }

        // Rimuove l'intestazione con la versione di PHP
        header_remove('X-Powered-By');

        // Previene MIME-type sniffing
        header('X-Content-Type-Options: nosniff');

        // Protezione contro clickjacking
        header('X-Frame-Options: SAMEORIGIN');

        // Protezione legacy XSS per browser compatibili
        header('X-XSS-Protection: 1; mode=block');

        // Politica di referrer restrittiva
        header('Referrer-Policy: strict-origin-when-cross-origin');

        // Limitazione API browser non necessarie
        header('Permissions-Policy: camera=(), microphone=(), geolocation=()');

        // Content Security Policy permissiva per asset locali e font sicuri
        $csp = [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com data:",
            "img-src 'self' data: blob: https:",
            "connect-src 'self' http://localhost:* http://127.0.0.1:* ws://localhost:* ws://127.0.0.1:*",
            "frame-ancestors 'self'",
        ];
        header('Content-Security-Policy: ' . implode('; ', $csp));

        // Gestione CORS per ambiente di sviluppo locale (es. Vite su 5173)
        self::handleCors();
    }

    /**
     * Gestisce le intestazioni CORS per chiamate API cross-origin in dev.
     */
    public static function handleCors(): void
    {
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        $allowedOrigins = [
            'http://localhost:5173',
            'http://127.0.0.1:5173',
            'http://localhost:3000',
            'http://127.0.0.1:3000',
        ];

        if (in_array($origin, $allowedOrigins, true)) {
            header("Access-Control-Allow-Origin: {$origin}");
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
            header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept');
        }
    }

    /**
     * Sanitizza una stringa per prevenire injection XSS.
     */
    public static function sanitize(string $input): string
    {
        return htmlspecialchars(trim($input), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    }

    /**
     * Verifica e restituisce un percorso sicuro all'interno della cartella base
     * prevenendo attacchi di tipo Directory Traversal (es. ../../).
     */
    public static function safeFilePath(string $baseDir, string $relativePath): ?string
    {
        $realBase = realpath($baseDir);
        if ($realBase === false) {
            return null;
        }

        // Costruisci percorso target
        $target = $realBase . DIRECTORY_SEPARATOR . str_replace(['/', '\\'], DIRECTORY_SEPARATOR, $relativePath);
        $realTarget = realpath($target);

        // Se il file esiste, deve risiedere dentro la cartella base
        if ($realTarget !== false && str_starts_with($realTarget, $realBase)) {
            return $realTarget;
        }

        return null;
    }
}

