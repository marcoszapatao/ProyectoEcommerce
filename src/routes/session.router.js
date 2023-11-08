import { Router } from "express";
import UserModel from "../dao/models/user.model.js";

const router = Router();

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
        const user = await UserModel.findOne({ email, password });
        if (!user) {
            return res.redirect('/session/login');
        }
        req.session.user = user;
        res.redirect('/products');
    } catch (error) {
        res.status(500).send(error.message);
    }

})

export default router;