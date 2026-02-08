// Game State
let gameState = {
    mode: null, // 'single' or 'multi'
    playerCount: 0,
    playerNames: [], // Array of player names
    impostorCount: 1,
    currentPlayer: 0,
    roles: [],
    revealed: false,
    currentWord: null,
    myPlayerName: '', // For multi mode
    pin: '' // PIN entered
};

// Initialize word manager
let wordManager = null;

// Password
const CORRECT_PASSWORD = "7845";

// DOM Elements
const screens = {
    login: document.getElementById('login-screen'),
    mode: document.getElementById('mode-screen'),
    singleGame: document.getElementById('single-game-screen'),
    reveal: document.getElementById('reveal-screen'),
    multiSetup: document.getElementById('multi-setup-screen'),
    multiGame: document.getElementById('multi-game-screen')
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Initialize word manager
    wordManager = new UsedWordsManager();
    console.log('Word bank loaded:', WORD_BANK.length, 'words');
    console.log('Used words:', wordManager.getUsedWordsCount());
    
    initializeEventListeners();
});

function initializeEventListeners() {
    // Login (PIN Pad)
    document.querySelectorAll('.pin-btn').forEach(btn => {
        btn.addEventListener('click', handlePinInput);
    });

    // Mode Selection
    document.getElementById('single-phone-btn').addEventListener('click', () => selectMode('single'));
    document.getElementById('multi-phone-btn').addEventListener('click', () => selectMode('multi'));

    // Single Phone Configuration
    document.getElementById('add-player-btn').addEventListener('click', addPlayerInput);
    document.getElementById('players-container').addEventListener('click', (e) => {
        if (e.target.closest('.remove-player-btn')) {
            removePlayerInput(e.target.closest('.remove-player-btn'));
        }
    });

    document.getElementById('decrease-impostors').addEventListener('click', () => adjustImpostors(-1));
    document.getElementById('increase-impostors').addEventListener('click', () => adjustImpostors(1));
    document.getElementById('start-single-game').addEventListener('click', startSinglePhoneGame);

    // Role Reveal
    document.getElementById('role-display').addEventListener('click', revealRole);
    document.getElementById('next-player-btn').addEventListener('click', nextPlayer);
    document.getElementById('finish-game-btn').addEventListener('click', finishGame);

    // Multi Phone
    document.getElementById('continue-multi-btn').addEventListener('click', handleMultiSetup);
    document.getElementById('copy-link-btn').addEventListener('click', copyGameLink);
    document.getElementById('start-multi-game').addEventListener('click', startMultiPhoneGame);
}

// Login Handler (PIN Pad)
function handlePinInput(e) {
    const btn = e.target;
    
    // Si es un botón deshabilitado o vacío (como el espacio en blanco)
    if (btn.disabled || !btn.textContent && !btn.classList.contains('delete-btn')) return;

    // Handle Delete
    if (btn.classList.contains('delete-btn') || btn.id === 'pin-delete') {
        gameState.pin = gameState.pin.slice(0, -1);
        updatePinDisplay();
        document.getElementById('error-message').textContent = '';
        return;
    }

    // Handle Number input
    if (gameState.pin.length < 4) {
        const val = btn.dataset.val;
        gameState.pin += val;
        updatePinDisplay();
        
        // Auto-check when length is 4
        if (gameState.pin.length === 4) {
            checkPin();
        }
    }
}

function updatePinDisplay() {
    const dots = document.querySelectorAll('.pin-dot');
    dots.forEach((dot, index) => {
        if (index < gameState.pin.length) {
            dot.classList.add('filled');
        } else {
            dot.classList.remove('filled', 'error');
        }
    });
}

function checkPin() {
    if (gameState.pin === CORRECT_PASSWORD) {
        // Success
        setTimeout(() => {
            gameState.pin = '';
            updatePinDisplay();
            switchScreen('mode');
        }, 200);
    } else {
        // Error
        setTimeout(() => {
            const dots = document.querySelectorAll('.pin-dot');
            dots.forEach(dot => dot.classList.add('error'));
            document.getElementById('error-message').textContent = 'PIN Incorrecto';
            
            // Clear after animation
            setTimeout(() => {
                gameState.pin = '';
                updatePinDisplay();
                document.getElementById('error-message').textContent = '';
            }, 600);
        }, 100);
    }
}

// Mode Selection
function selectMode(mode) {
    gameState.mode = mode;
    
    if (mode === 'single') {
        switchScreen('singleGame');
        initializePlayerInputs(); // Inicializar inputs por defecto
    } else {
        switchScreen('multiSetup'); // Ir a pantalla de nombre primero
    }
}

// Single Phone Inputs Management
function initializePlayerInputs() {
    const container = document.getElementById('players-container');
    container.innerHTML = ''; // Limpiar
    
    // Agregar 3 jugadores por defecto
    addPlayerInput();
    addPlayerInput();
    addPlayerInput();
}

function addPlayerInput() {
    const container = document.getElementById('players-container');
    const count = container.children.length + 1;
    
    // Max 20 jugadores
    if (count > 20) return;

    const div = document.createElement('div');
    div.className = 'player-input-row';
    div.innerHTML = `
        <input type="text" class="player-name-input" placeholder="Nombre Jugador ${count}">
        <button class="remove-player-btn" aria-label="Eliminar">🗑️</button>
    `;
    
    container.appendChild(div);
    updatePlayerCountUI();
}

function removePlayerInput(btn) {
    const container = document.getElementById('players-container');
    
    // Min 3 jugadores
    if (container.children.length <= 3) return;
    
    const row = btn.closest('.player-input-row');
    row.remove();
    updatePlayerCountUI();
    
    // Re-enumerar placeholders (opcional, visual)
    Array.from(container.children).forEach((child, index) => {
        const input = child.querySelector('input');
        if (!input.value) {
            input.placeholder = `Nombre Jugador ${index + 1}`;
        }
    });
}

function updatePlayerCountUI() {
    const container = document.getElementById('players-container');
    const count = container.children.length;
    
    document.getElementById('player-count-badge').textContent = count;
    gameState.playerCount = count;
    
    // Ensure impostors don't exceed players - 1
    if (gameState.impostorCount >= count) {
        gameState.impostorCount = Math.max(1, count - 1);
        document.getElementById('impostor-count').textContent = gameState.impostorCount;
    }
}

function adjustImpostors(delta) {
    const newCount = gameState.impostorCount + delta;
    const maxImpostors = gameState.playerCount - 1;
    
    if (newCount >= 1 && newCount <= maxImpostors) {
        gameState.impostorCount = newCount;
        document.getElementById('impostor-count').textContent = newCount;
    }
}

// Start Single Phone Game
function startSinglePhoneGame() {
    // Collect Names
    const inputs = document.querySelectorAll('.player-name-input');
    const names = [];
    let hasError = false;
    
    inputs.forEach((input, index) => {
        const name = input.value.trim();
        if (!name) {
            input.style.borderColor = 'red';
            hasError = true;
        } else {
            input.style.borderColor = '';
            names.push(name);
        }
    });
    
    if (hasError) {
        document.getElementById('players-error').textContent = 'Todos los jugadores deben tener nombre';
        return;
    }
    
    document.getElementById('players-error').textContent = '';
    gameState.playerNames = names;

    // Select a random word from the bank
    gameState.currentWord = wordManager.getRandomUnusedWord(WORD_BANK);
    console.log('Selected word:', gameState.currentWord);
    
    // Generate roles
    gameState.roles = generateRoles(gameState.playerCount, gameState.impostorCount);
    gameState.currentPlayer = 0;
    gameState.revealed = false;
    
    // Update UI for first player
    updateTurnDisplay();
    
    document.getElementById('next-player-btn').style.display = 'none';
    document.getElementById('finish-game-btn').style.display = 'none';
    
    // Reset display content
    resetRoleDisplay();
    
    switchScreen('reveal');
}

function updateTurnDisplay() {
    const currentPlayerName = gameState.playerNames[gameState.currentPlayer];
    document.getElementById('current-player-name').textContent = currentPlayerName;
}

function resetRoleDisplay() {
    const roleDisplay = document.getElementById('role-display');
    roleDisplay.classList.remove('role-impostor', 'role-innocent');
    roleDisplay.innerHTML = `
        <div class="role-icon">👤</div>
        <h2 class="role-text">Toca para ver tu rol</h2>
    `;
}

// Generate Roles
function generateRoles(playerCount, impostorCount) {
    const roles = [];
    
    // Add impostors
    for (let i = 0; i < impostorCount; i++) {
        roles.push('impostor');
    }
    
    // Add innocents
    for (let i = 0; i < playerCount - impostorCount; i++) {
        roles.push('inocente');
    }
    
    // Shuffle array
    return shuffleArray(roles);
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Reveal Role
function revealRole() {
    if (gameState.revealed) return;
    
    const roleDisplay = document.getElementById('role-display');
    const role = gameState.roles[gameState.currentPlayer];
    
    if (role === 'impostor') {
        roleDisplay.classList.add('role-impostor');
        roleDisplay.innerHTML = `
            <div class="role-icon">😈</div>
            <h2 class="role-text">¡Eres el IMPOSTOR!</h2>
            <p class="role-instruction">No tienes palabra. Descubre cuál es sin que te descubran.</p>
        `;
    } else {
        roleDisplay.classList.add('role-innocent');
        roleDisplay.innerHTML = `
            <div class="role-icon">😇</div>
            <h2 class="role-text">Eres Inocente</h2>
            <div class="secret-word">
                <p class="word-label">Tu palabra es:</p>
                <p class="word-display">${gameState.currentWord}</p>
            </div>
            <p class="role-instruction">Describe esta palabra sin decirla directamente.</p>
        `;
    }
    
    gameState.revealed = true;
    
    // Show appropriate button
    if (gameState.currentPlayer < gameState.playerCount - 1) {
        document.getElementById('next-player-btn').style.display = 'block';
    } else {
        document.getElementById('finish-game-btn').style.display = 'block';
    }
}

// Next Player
function nextPlayer() {
    gameState.currentPlayer++;
    gameState.revealed = false;
    
    updateTurnDisplay();
    resetRoleDisplay();
    
    document.getElementById('next-player-btn').style.display = 'none';
}

// Finish Game
function finishGame() {
    gameState.currentPlayer = 0;
    gameState.revealed = false;
    gameState.roles = [];
    gameState.playerNames = [];
    
    // Just go back to mode selection to start over easily
    // Or if we want to keep names, go back to singleGame screen directly
    switchScreen('singleGame');
}

// Multi Phone Game Logic
let pollInterval = null;
const API_URL = 'server.php';

function handleMultiSetup() {
    const input = document.getElementById('my-player-name');
    const name = input.value.trim();
    
    if (name) {
        gameState.myPlayerName = name;
        switchScreen('multiGame');
        startPolling();
    } else {
        input.style.border = '2px solid red';
        setTimeout(() => input.style.border = '', 2000);
    }
}

function startPolling() {
    // Initial Join
    fetch(`${API_URL}?action=join&name=${encodeURIComponent(gameState.myPlayerName)}`)
        .then(res => res.json())
        .then(data => updateMultiUI(data))
        .catch(err => console.error('Error joining room:', err));

    // Poll every 2 seconds
    if (pollInterval) clearInterval(pollInterval);
    pollInterval = setInterval(() => {
        fetch(`${API_URL}?action=poll&name=${encodeURIComponent(gameState.myPlayerName)}`)
            .then(res => res.json())
            .then(data => {
                updateMultiUI(data);
                checkGameState(data);
            })
            .catch(err => console.error('Polling error:', err));
    }, 2000);
}

function updateMultiUI(data) {
    const list = document.getElementById('players-list');
    const count = document.getElementById('connected-count');
    
    // Update count
    count.textContent = data.players.length;
    gameState.playerCount = data.players.length; // Sync count for logic
    
    // Update visual list
    list.innerHTML = '';
    data.players.forEach(p => {
        const div = document.createElement('div');
        div.className = 'player-item';
        div.textContent = p.name + (p.name === gameState.myPlayerName ? ' (Tú)' : '');
        if (p.name === gameState.myPlayerName) {
            div.style.background = 'hsl(280, 70%, 95%)';
            div.style.fontWeight = 'bold';
        }
        list.appendChild(div);
    });

    // Update Start Button (only if enough players)
    const startBtn = document.getElementById('start-multi-game');
    if (data.players.length < 3) {
        startBtn.disabled = true;
        startBtn.textContent = `Esperando jugadores (${data.players.length}/3)`;
    } else {
        startBtn.disabled = false;
        startBtn.textContent = 'Iniciar Juego para Todos';
    }
}

function startMultiPhoneGame() {
    // Host logic: Generate roles and send to server
    // 1. Get current players from state (we rely on last poll, but lets fetch fresh)
    fetch(`${API_URL}?action=poll&name=${encodeURIComponent(gameState.myPlayerName)}`)
        .then(res => res.json())
        .then(data => {
            const players = data.players.map(p => p.name);
            const impostorCount = 1; // Default for now
            
            // Generate assignments
            const word = wordManager.getRandomUnusedWord(WORD_BANK);
            const rolesList = generateRoles(players.length, impostorCount);
            
            // Map roles to specific names
            const gameData = {};
            players.forEach((name, index) => {
                gameData[name] = {
                    role: rolesList[index],
                    word: rolesList[index] === 'impostor' ? null : word
                };
            });
            
            // Send to server
            fetch(`${API_URL}?action=start`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(gameData)
            });
        });
}

function checkGameState(data) {
    if (data.status === 'playing' && data.gameData) {
        // Game Started!
        const myData = data.gameData[gameState.myPlayerName];
        if (myData) {
            clearInterval(pollInterval); // Stop polling
            showMyRole(myData);
        }
    }
}

function showMyRole(myData) {
    const roleDisplay = document.getElementById('role-display');
    
    // Reset classes
    roleDisplay.classList.remove('role-impostor', 'role-innocent');
    
    if (myData.role === 'impostor') {
        roleDisplay.classList.add('role-impostor');
        roleDisplay.innerHTML = `
            <div class="role-icon">😈</div>
            <h2 class="role-text">¡Eres el IMPOSTOR!</h2>
            <p class="role-instruction">No tienes palabra. Descubre cuál es sin que te descubran.</p>
        `;
    } else {
        roleDisplay.classList.add('role-innocent');
        roleDisplay.innerHTML = `
            <div class="role-icon">😇</div>
            <h2 class="role-text">Eres Inocente</h2>
            <div class="secret-word">
                <p class="word-label">Tu palabra es:</p>
                <p class="word-display">${myData.word}</p>
            </div>
            <p class="role-instruction">Describe esta palabra sin decirla directamente.</p>
        `;
    }
    
    // Customize reveal screen for Multi Mode
    document.getElementById('player-turn-display').style.display = 'none'; // No turns in multi
    document.getElementById('next-player-btn').style.display = 'none';
    
    // New "New Game" button for multi
    let resetBtn = document.getElementById('reset-multi-btn');
    if (!resetBtn) {
        resetBtn = document.createElement('button');
        resetBtn.id = 'reset-multi-btn';
        resetBtn.className = 'btn btn-primary';
        resetBtn.textContent = 'Nueva Partida';
        resetBtn.style.marginTop = '20px';
        resetBtn.addEventListener('click', resetMultiGame);
        document.querySelector('.reveal-card').appendChild(resetBtn);
    }
    resetBtn.style.display = 'block';
    
    switchScreen('reveal');
}

function resetMultiGame() {
    fetch(`${API_URL}?action=reset`)
        .then(() => {
            switchScreen('multiGame');
            startPolling();
        });
}

function copyGameLink() {
   // Just copy the URL without query params
   const url = window.location.href.split('?')[0];
    navigator.clipboard.writeText(url).then(() => {
        const btn = document.getElementById('copy-link-btn');
        btn.textContent = '✓ URL Copiada';
        setTimeout(() => btn.textContent = '🔗 Copiar Enlace', 2000);
    });
}

// Screen Management
function switchScreen(screenName) {
    // Hide all screens
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show selected screen
    if (screens[screenName]) {
        screens[screenName].classList.add('active');
    } else {
        console.error('Screen not found:', screenName);
    }
}

// Add shake animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);
