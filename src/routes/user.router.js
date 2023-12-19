import { Router } from "express";
import { isLoggedIn } from '../isLoggedIn.js';
import passport from "passport";
import { register, profile, current} from '../controllers/user.controller.js';

const router = Router();

//Vista para registrar usuarios
router.get('/register', (req, res) => {res.render('sessions/register')})
//Registrar usuarios
router.post('/register', register);
//Fail register
router.get('/failRegister', (req, res) => res.send({ error: 'Failed' }))
//Profile
router.get('/profile', isLoggedIn, profile);
// Private
router.get('/current', passport.authenticate('jwt', { session: false }), current)

export default router;