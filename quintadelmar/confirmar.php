<?php
/**
 * Parche pago manual Quac QM-1749493
 * Recibe el beacon de la pagina de confirmacion y deja registro de que
 * el cliente abrio el sitio (= confirmo desde la app).
 *
 * Despliegue: subir junto a pago-manual-quac-QM-1749493.html en el mismo
 * directorio publico del servidor de quinta-web. El log queda en el mismo
 * directorio (proteger o mover fuera del docroot si se prefiere).
 */

header('Content-Type: application/json; charset=utf-8');

// Solo POST (sendBeacon/fetch de la pagina)
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'metodo no permitido']);
    exit;
}

$cuerpo = file_get_contents('php://input');
$datos  = json_decode($cuerpo, true);

$registro = [
    'fecha_servidor' => date('Y-m-d H:i:s'),
    'referencia'     => isset($datos['referencia']) ? substr((string) $datos['referencia'], 0, 30) : 'desconocida',
    'evento'         => isset($datos['evento']) ? substr((string) $datos['evento'], 0, 40) : 'sin_evento',
    'fecha_cliente'  => isset($datos['fecha']) ? substr((string) $datos['fecha'], 0, 40) : null,
    'ip'             => $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'sin_ip',
    'user_agent'     => substr($_SERVER['HTTP_USER_AGENT'] ?? 'sin_ua', 0, 250),
];

// 1) Registro en log (una linea JSON por evento)
$archivoLog = __DIR__ . '/confirmaciones-quac.log';
file_put_contents($archivoLog, json_encode($registro, JSON_UNESCAPED_UNICODE) . PHP_EOL, FILE_APPEND | LOCK_EX);

// 2) Notificacion por correo al operador (opcional: descomentar y ajustar)
// $para    = 'operaciones@quintadelmar.com.co';
// $asunto  = 'Confirmacion pago Quac ' . $registro['referencia'];
// $mensaje = 'El cliente abrio la pagina de confirmacion.' . "\n\n" . print_r($registro, true);
// @mail($para, $asunto, $mensaje);

// 3) Registro en BD (opcional: si el archivo vive dentro de quinta-web,
//    incluir su config y hacer el INSERT en la tabla que prefieran)
// require_once __DIR__ . '/../app/config.php';
// ...INSERT INTO confirmaciones_quac (referencia, fecha, ip, user_agent) VALUES (...)

echo json_encode(['ok' => true]);
