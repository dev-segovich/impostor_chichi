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

// Multi Phone Game
function handleMultiSetup() {
    const input = document.getElementById('my-player-name');
    const name = input.value.trim();
    
    if (name) {
        gameState.myPlayerName = name;
        switchScreen('multiGame');
        generateGameCode();
        
        // Add self to list
        const playerList = document.getElementById('players-list');
        playerList.innerHTML = `
            <div class="player-item">${name} (Tú)</div>
        `;
    } else {
        input.style.border = '2px solid red';
        setTimeout(() => input.style.border = '', 2000);
    }
}

function generateGameCode() {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    document.getElementById('game-code').textContent = code;
}

function copyGameLink() {
    const code = document.getElementById('game-code').textContent;
    const link = `${window.location.origin}${window.location.pathname}?game=${code}`;
    
    navigator.clipboard.writeText(link).then(() => {
        const btn = document.getElementById('copy-link-btn');
        const originalText = btn.textContent;
        btn.textContent = '✓ Invitación Copiada';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    }).catch(() => {
        alert('No se pudo copiar el enlace');
    });
}

function startMultiPhoneGame() {
    alert('Funcionalidad multi-teléfono en desarrollo. Por ahora, usa el modo de un solo teléfono.');
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
