<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\Controller;
use App\Core\Security;

final class ApiController extends Controller
{
    /**
     * Endpoint di test e verifica connessione backend.
     */
    public function ping(): void
    {
        $this->json([
            'ok' => true,
            'service' => 'EcosiSTEM API',
            'time' => date('c'),
        ]);
    }

    /**
     * Endpoint di monitoraggio dello stato del sistema.
     */
    public function health(): void
    {
        $dataPath = __DIR__ . '/../../public/assets/data/glossario.json';
        $glossarioExists = is_file($dataPath) && is_readable($dataPath);

        $this->json([
            'status' => $glossarioExists ? 'healthy' : 'degraded',
            'storage_accessible' => $glossarioExists,
            'timestamp' => time(),
        ]);
    }

    /**
     * Fornisce i dati del glossario STEM con supporto a cache ETag e controllo integrità.
     */
    public function glossario(): void
    {
        $dataDir = __DIR__ . '/../../public/assets/data';
        $filePath = Security::safeFilePath($dataDir, 'glossario.json');

        if (!$filePath || !is_file($filePath)) {
            $this->error('File glossario non trovato o inaccessibile.', 404);
            return;
        }

        $content = file_get_contents($filePath);
        if ($content === false) {
            $this->error('Impossibile leggere i dati del glossario.', 500);
            return;
        }

        // Calcola ETag per il caching HTTP
        $rawEtag = md5($content);
        $etag = '"' . $rawEtag . '"';
        $clientEtag = trim($_SERVER['HTTP_IF_NONE_MATCH'] ?? '', "\"' \t\n\r\0\x0B");

        if ($clientEtag === $rawEtag) {
            http_response_code(304);
            exit;
        }

        $data = json_decode($content, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            $this->error('Formato JSON del glossario non valido.', 500);
            return;
        }

        $this->json($data, 200, [
            'ETag' => $etag,
            'Cache-Control' => 'public, max-age=300',
        ]);
    }
}

