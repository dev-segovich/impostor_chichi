<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

$file = 'gamestate.json';

// Inicializar archivo si no existe
if (!file_exists($file)) {
    $initialState = [
        'status' => 'waiting', // waiting, playing
        'players' => [],
        'gameData' => null, // roles, word, etc.
        'lastUpdate' => time()
    ];
    file_put_contents($file, json_encode($initialState));
}

// Leer estado actual
$currentState = json_decode(file_get_contents($file), true);
$action = $_GET['action'] ?? '';

// Limpiar jugadores inactivos (más de 30 seg sin poll)
// Actualizar timestamp del jugador actual si estamos en poll o join
$now = time();
if (isset($_GET['name'])) {
    $name = $_GET['name'];
    // Actualizar last_seen
    $found = false;
    foreach ($currentState['players'] as &$p) {
        if ($p['name'] === $name) {
            $p['last_seen'] = $now;
            $found = true;
            break;
        }
    }
    if (!$found && $action === 'join') {
        $currentState['players'][] = [
            'name' => $name,
            'last_seen' => $now
        ];
    }
}

// Eliminar inactivos (solo si estamos esperando)
if ($currentState['status'] === 'waiting') {
    $activePlayers = [];
    foreach ($currentState['players'] as $p) {
        if ($now - $p['last_seen'] < 20) { // 20 segundos de timeout
            $activePlayers[] = $p;
        }
    }
    $currentState['players'] = $activePlayers;
}

// Manejar acciones
switch ($action) {
    case 'join':
        // Ya manejado arriba
        break;
        
    case 'start':
        // Recibir datos del juego (roles asignados por el host)
        $input = json_decode(file_get_contents('php://input'), true);
        if ($input) {
            $currentState['status'] = 'playing';
            $currentState['gameData'] = $input;
        }
        break;
        
    case 'reset':
        $currentState['status'] = 'waiting';
        $currentState['gameData'] = null;
        // No borramos jugadores para que no tengan que reconectarse
        break;
        
    case 'poll':
        // Solo lectura, ya se actualizó el heartbeat arriba
        break;
}

// Guardar y responder
file_put_contents($file, json_encode($currentState));
echo json_encode($currentState);
?>
