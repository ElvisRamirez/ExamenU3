const socket = io();
let currentUser = null;

// Verificar si el usuario está autenticado
async function checkAuth() {
    try {
        const response = await fetch('/api/profile');
        if (response.ok) {
            const data = await response.json();
            currentUser = data.user;
            showApp();
        } else {
            showLogin();
        }
    } catch (error) {
        showLogin();
    }
}

function showLogin() {
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('app-section').style.display = 'none';
}

function showApp() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('app-section').style.display = 'block';
}

// Listeners para botones de puntaje
document.getElementById('btnTeamA').addEventListener('click', () => {
    socket.emit('score:teamA', { user: currentUser.displayName });
});

document.getElementById('btnTeamB').addEventListener('click', () => {
    socket.emit('score:teamB', { user: currentUser.displayName });
});

// Cerrar sesión
document.getElementById('logout').addEventListener('click', async () => {
    await fetch('/auth/logout', { method: 'POST' });
    location.reload();
});

// Escuchar actualizaciones de puntaje en tiempo real
socket.on('score:update', (gameState) => {
    document.getElementById('scoreA').textContent = gameState.teamA;
    document.getElementById('scoreB').textContent = gameState.teamB;
    document.getElementById('lastUser').textContent = 
        gameState.lastUpdatedBy || '-';
    document.getElementById('timestamp').textContent = 
        new Date(gameState.timestamp).toLocaleTimeString();
});

// Inicializar aplicación
checkAuth();