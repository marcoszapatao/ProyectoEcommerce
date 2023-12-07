import { Router } from "express";
import UserModel from "../dao/models/user.model.js";
import { isLoggedIn } from '../isLoggedIn.js';
import passport from "passport";
import { generateToken  } from "../utils.js";
import { register, login, profile, logout, current, githubLogin, githubCallback} from '../controllers/session.controller.js';

const router = Router();
const ADMIN_EMAIL = "adminCoder@coder.com";
const ADMIN_PASSWORD = "adminCod3r123";

//Vista para registrar usuarios
router.get('/register', (req, res) => {res.render('sessions/register')})
//Registrar usuarios
router.post('/register', register);
//Fail register
router.get('/failRegister', (req, res) => res.send({ error: 'Failed' }))
// Vista de Login
router.get('/login', (req, res) => {res.render('sessions/login')})
//Login
router.post('/login', login);
//Fail Login
router.get('/failLogin', (req, res) => res.send({ error: 'Failed' }))
//Profile
router.get('/profile', isLoggedIn, profile);
// Cerrar Session
router.get('/logout', logout)
// Private
router.get('/current', passport.authenticate('jwt', { session: false }), current)

//Login GitHub
router.get('/login-github', githubLogin)
router.get('/githubcallback', passport.authenticate('github', { session: false, failureRedirect: '/session/login' }), githubCallback)

export default router;