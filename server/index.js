
require('dotenv').config(); // ¡ESTO DEBE IR PRIMERO!
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('./config/passport');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));
app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());

// Estado global del marcador
let gameState = {
    teamA: 0,
    teamB: 0,
    lastUpdatedBy: null,
    timestamp: new Date()
};

// Rutas
app.use('/auth', require('./routes/auth'));
app.use('/api', require('./routes/api'));

// Socket.io - Tiempo Real
io.on('connection', (socket) => {
    console.log('Usuario conectado:', socket.id);
    
    // Enviar estado actual al cliente recién conectado
    socket.emit('score:update', gameState);
    
    // Escuchar puntos para equipos
    socket.on('score:teamA', (data) => {
        gameState.teamA++;
        gameState.lastUpdatedBy = data.user;
        gameState.timestamp = new Date();
        
        // Emitir a todos los clientes conectados
        io.emit('score:update', gameState);
    });
    
    socket.on('score:teamB', (data) => {
        gameState.teamB++;
        gameState.lastUpdatedBy = data.user;
        gameState.timestamp = new Date();
        
        // Emitir a todos los clientes conectados
        io.emit('score:update', gameState);
    });
    
    socket.on('disconnect', () => {
        console.log('Usuario desconectado:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});