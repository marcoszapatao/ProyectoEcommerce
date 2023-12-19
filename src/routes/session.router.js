import { Router } from "express";
import passport from "passport";
import { login, logout, githubLogin, githubCallback} from '../controllers/session.controller.js';

const router = Router();
//const ADMIN_EMAIL = "adminCoder@coder.com";
//const ADMIN_PASSWORD = "adminCod3r123";

// Vista de Login
router.get('/login', (req, res) => {res.render('sessions/login')})
//Login
router.post('/login', login);
//Fail Login
router.get('/failLogin', (req, res) => res.send({ error: 'Failed' }))
// Cerrar Session
router.get('/logout', logout)
//Login GitHub
router.get('/login-github', githubLogin)
router.get('/githubcallback', passport.authenticate('github', { session: false, failureRedirect: '/session/login' }), githubCallback)

export default router;