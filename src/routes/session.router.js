import { Router } from "express";
import UserModel from "../dao/models/user.model.js";
import { isLoggedIn } from '../isLoggedIn.js';

const router = Router();
const ADMIN_EMAIL = "adminCoder@coder.com";
const ADMIN_PASSWORD = "adminCod3r123";
//Vista para registrar usuarios
router.get('/register', (req, res) => {
    res.render('sessions/register')
})

router.post('/register', async(req, res) =>{
    try {
        const user = req.body;
        await UserModel.create(user);
        res.redirect('/session/login'); 
    } catch (error) {
        res.status(500).send(error.message);
    }
})

// Vista de Login
router.get('/login', (req, res) => {
    res.render('sessions/login')
})

router.post('/login', async(req, res) =>{
    try {
        const { email, password } = req.body;

        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            req.session.user = { email, role: 'admin' };
            return res.redirect('/products');
        } 
        const user = await UserModel.findOne({ email, password });
        if (!user) {
            return res.redirect('/session/login');
        }
        //req.session.user = { user, role: 'usuario' };;
        req.session.user = { 
            id: user._id, 
            first_name: user.first_name, 
            last_name: user.last_name,
            email: user.email, 
            role: 'usuario'
        };
        res.redirect('/products');
    } catch (error) {
        res.status(500).send(error.message);
    }

})


router.get('/profile', isLoggedIn, async (req, res) => {
    try {
        const userId = req.session.user.id;
        const user = await UserModel.findById(userId).select('-password'); 
        if (!user) {
            return res.redirect('/session/login');
        }
        res.render('sessions/profile', {
            first_name: user.first_name,
            last_name: user.last_name,
            age: user.age,
            email: user.email
        });
    } catch (error) {
        console.error('Error al obtener la información del perfil:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Cerrar Session
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if(err) {
            console.log(err);
            res.status(500).render('errors/base', {error: err})
        } else res.redirect('/session/login')
    })
})

export default router;