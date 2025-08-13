const express = require('express');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

// Ruta protegida - Perfil del usuario
router.get('/profile', verifyToken, (req, res) => {
    res.json({
        user: req.user,
        message: 'Acceso autorizado al perfil'
    });
});

// Ruta protegida - Acción del marcador
router.post('/score', verifyToken, (req, res) => {
    const { team } = req.body;
    // Lógica para actualizar marcador
    // Se conectará con Socket.io para tiempo real
    res.json({ 
        success: true, 
        team, 
        user: req.user.displayName 
    });
});

module.exports = router;