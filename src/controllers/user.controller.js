import passport from "passport";
import UserRepository from '../services/users.repository.js';
import UserDao from '../dao/usersDao.js'

const UserService = new UserRepository(new UserDao())

export const register = (req, res, next) => {
    passport.authenticate('register', (err, user, info) => {
        if (err) {
            return next(err); 
        }
        if (!user) {
            return res.redirect('/user/failRegister'); 
        }
        res.redirect('/session/login');
    })(req, res, next);
};

export const profile = async (req, res) => {
    try {
        //const user = req.user;
        const user = await UserService.getUserById(req.user._id);
        if (!user) {
            return res.redirect('/session/login');
        }
        // const userData = {
        //     first_name: user.first_name,
        //     last_name: user.last_name,
        //     age: user.age,
        //     email: user.email
        // };
        //res.render('sessions/profile', userData);
        res.render('sessions/profile', user.toObject());
    } catch (error) {
        console.error('Error al obtener la información del perfil:', error);
        res.status(500).send('Error interno del servidor');
    }
};

export const current = (req, res) => {
    try {
        const userData = req.user.toObject();
        delete userData.password;
        res.render('sessions/current', { user: userData });
    } catch (error) {
        console.error('Error al obtener la información del usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
};