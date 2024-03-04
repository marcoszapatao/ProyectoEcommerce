import { Router } from "express";
import { isLoggedIn } from '../isLoggedIn.js';
import passport from "passport";
import { register, profile, current, getAllUsers, deleteInactiveUsers} from '../controllers/user.controller.js';
import authorize from '../authMiddleware.js';
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
//Ver usuarios
router.get('/', passport.authenticate('jwt', { session: false }), authorize('admin'), getAllUsers)
//Elimina usuarios inactivos
router.delete('/', passport.authenticate('jwt', { session: false }), authorize('admin'), deleteInactiveUsers)

export default router;