<?php
// $pageTitle disponibile se vuoi sovrascrivere <title>
$source = __DIR__ . '/../../frontend/home.html';
if (is_file($source)) {
    // opzionale: sostituisci <title> al volo
    $html = file_get_contents($source);
    if (isset($pageTitle)) {
        $html = preg_replace('~(<title>)(.*?)(</title>)~i', '$1' . htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8') . '$3', $html, 1);
    }
    echo $html;
} else {
    echo '<h1>home.html non trovato</h1>';
}
