<?php
declare(strict_types=1);
?>
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($pageTitle ?? 'EcosiSTEM', ENT_QUOTES, 'UTF-8') ?></title>
    <style>
        body {
            font-family: system-ui, -apple-system, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0;
            padding: 20px;
            color: #2d3748;
        }
        .card {
            background: white;
            border-radius: 16px;
            padding: 40px;
            max-width: 600px;
            width: 100%;
            box-shadow: 0 20px 40px rgba(0,0,0,0.15);
            text-align: center;
        }
        h1 {
            color: #2b6cb0;
            margin-top: 0;
        }
        .code-box {
            background: #f7fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 15px;
            font-family: monospace;
            text-align: left;
            margin: 20px 0;
            overflow-x: auto;
        }
        .btn {
            display: inline-block;
            background: #3182ce;
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: bold;
            margin: 5px;
        }
        .btn:hover {
            background: #2b6cb0;
        }
    </style>
</head>
<body>
    <div class="card">
        <h1>🌱 EcosiSTEM Backend Attivo</h1>
        <p>Il server PHP backend è operativo e sicuro!</p>
        <p>Per compilare il frontend React con Tailwind CSS, esegui:</p>
        <div class="code-box">
            cd frontend<br>
            npm install<br>
            npm run build
        </div>
        <p>Oppure avvia il dev server con Live Reload su <code>http://localhost:5173</code>:</p>
        <div class="code-box">
            cd frontend<br>
            npm run dev
        </div>
        <div>
            <a class="btn" href="/api/ping" target="_blank">Test API /ping</a>
            <a class="btn" href="/api/glossario" target="_blank">Test API /glossario</a>
            <a class="btn" href="/api/health" target="_blank">Test API /health</a>
        </div>
    </div>
</body>
</html>
