const express = require('express');
const passport = require('../config/passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Iniciar OAuth con GitHub
router.get('/github', passport.authenticate('github', { 
    scope: ['user:email'] 
}));

// Callback de GitHub
router.get('/github/callback', 
    passport.authenticate('github', { session: false }),
    (req, res) => {
        // Generar JWT después de OAuth exitoso
        const token = jwt.sign(
            { 
                id: req.user.id,
                username: req.user.username,
                displayName: req.user.displayName
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Enviar token como cookie
        res.cookie('token', token, { 
            httpOnly: true, 
            maxAge: 24 * 60 * 60 * 1000 
        });
        
       res.redirect('/?auth=success');
    }
);

// Cerrar sesión
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Sesión cerrada' });
});

module.exports = router;