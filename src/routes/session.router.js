import { Router } from "express";
import UserModel from "../dao/models/user.model.js";
import { isLoggedIn } from '../isLoggedIn.js';
import passport from "passport";
import { generateToken  } from "../utils.js";

const router = Router();
const ADMIN_EMAIL = "adminCoder@coder.com";
const ADMIN_PASSWORD = "adminCod3r123";
//Vista para registrar usuarios
router.get('/register', (req, res) => {
    res.render('sessions/register')
})

router.post('/register', passport.authenticate('register', { failureRedirect: '/session/failRegister' }), async(req, res) => {
    res.redirect('/session/login')
})

router.get('/failRegister', (req, res) => res.send({ error: 'Failed' }))

// Vista de Login
router.get('/login', (req, res) => {
    res.render('sessions/login')
})

// router.post('/login', passport.authenticate('login', { failureRedirect: '/session/failLogin' }), async(req, res) => {
//     if (!req.user) {
//         return res.status(400).send({ status: 'erorr', error: 'Invalid credentials' })
//     }
//     // const { email, password } = req.body;
//     // if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
//     //     req.session.user = { email, role: 'admin' };
//     //     return res.redirect('/products');
//     // } 
//     // req.session.user = { 
//     //     id: req.user._id, 
//     //     first_name: req.user.first_name, 
//     //     last_name: req.user.last_name,
//     //     email: req.user.email, 
//     //     role: 'usuario'
//     //};

//     //res.redirect('/products')
//     res.cookie('cookieJWT', req.user.token).redirect('/products')
// })

router.post('/login', 
passport.authenticate('login', { failureRedirect: '/session/failLogin' }),
 async (req, res) => {
    if (!req.user) {
        return res.status(400).send({ status: 'error', error: 'Invalid credentials' });
    }

    res.cookie('cookieJWT', req.user.token).redirect('/products');
});

router.get('/failLogin', (req, res) => res.send({ error: 'Failed' }))


router.get('/profile', isLoggedIn, async (req, res) => {
    try {
        //const userId = req.session.user.id;
        //const user = await UserModel.findById(userId).select('-password'); 
        const user = req.user
        if (!user) {
            console.log(user)
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

router.get(
    '/login-github',
    passport.authenticate('github', { scope: ['user:email'] }),
    async (req, res) => {}
)

router.get(
    '/githubcallback',
    passport.authenticate('github', { session: false, failureRedirect: '/session/login' }),
    async (req, res) => {
        console.log('Callback: ', req.user)
        // req.session.user = { 
        //     id: req.user._id, 
        //     first_name: req.user.first_name, 
        //     last_name: req.user.last_name,
        //     email: req.user.email, 
        //     role: 'usuario'
        // };
        if (!req.user) {
            return res.status(400).send({ status: 'error', error: 'Autenticación fallida' });
        }
        //console.log(req.session)
        //res.redirect('/products')
        const token = generateToken(req.user);
        res.cookie('cookieJWT', token).redirect('/products')
    }
)

// Cerrar Session
router.get('/logout', (req, res) => {
    res.clearCookie('cookieJWT').redirect('/session/login');
    // req.session.destroy(err => {
    //     if(err) {
    //         console.log(err);
    //         res.status(500).render('errors/base', {error: err})
    //     } else res.redirect('/session/login')
    // })
})

// Private
router.get(
    '/current',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        //const { user } = req
        const userData = req.user.toObject();
        delete userData.password;
        //console.log({ user })
        res.render('sessions/current', { user: userData })
    }
)

export default router;