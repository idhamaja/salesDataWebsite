<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'], // Path yang diizinkan untuk CORS

    'allowed_methods' => ['*'], // Metode HTTP yang diizinkan (GET, POST, dll.)

    'allowed_origins' => ['*'], // Domain yang diizinkan (gunakan '*' untuk semua domain)

    'allowed_origins_patterns' => [], // Pola domain yang diizinkan (regex)

    'allowed_headers' => ['*'], // Header yang diizinkan

    'exposed_headers' => [], // Header yang diekspos ke frontend

    'max_age' => 0, // Durasi cache preflight request (dalam detik)

    'supports_credentials' => false, // Izinkan credentials (cookies, authorization headers)

];
