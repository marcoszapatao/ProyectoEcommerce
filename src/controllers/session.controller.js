import passport from "passport";
import { generateToken  } from "../utils.js";

export const register = (req, res, next) => {
    passport.authenticate('register', (err, user, info) => {
        if (err) {
            return next(err); 
        }
        if (!user) {
            return res.redirect('/session/failRegister'); 
        }
        res.redirect('/session/login');
    })(req, res, next);
};

export const login = (req, res, next) => {
    passport.authenticate('login', (err, user, info) => {
      if (err) {
        return res.status(500).json({ status: 'error', error: err.message });
      }
      if (!user) {
        return res.status(400).json({ status: 'error', error: 'Invalid credentials' });
      }
      const token = user.token || generateToken(user);
      res.cookie('cookieJWT', token, { httpOnly: true });
      return res.redirect('/products');
    })(req, res, next);
  };


export const profile = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.redirect('/session/login');
        }
        const userData = {
            first_name: user.first_name,
            last_name: user.last_name,
            age: user.age,
            email: user.email
        };
        res.render('sessions/profile', userData);
    } catch (error) {
        console.error('Error al obtener la información del perfil:', error);
        res.status(500).send('Error interno del servidor');
    }
};

export const logout = (req, res) => {
        res.clearCookie('cookieJWT');
        res.redirect('/session/login');
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

export const githubLogin = passport.authenticate('github', { scope: ['user:email'] });

export const githubCallback = (req, res) => {
    if (!req.user) {
        return res.status(400).send({ status: 'error', error: 'Autenticación fallida' });
    }
    let email = req.user.email;
    if (!email) {
        email = `${req.user.username}@github.com`;
    }
    const token = generateToken(req.user);
    res.cookie('cookieJWT', token).redirect('/products');
};

