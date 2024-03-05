import passport from "passport";
import UserRepository from '../services/users.repository.js';
import UserDao from '../dao/usersDao.js'
import { userToDto } from '../dto/user.dto.js';

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
        const user = await UserService.getUserById(req.user._id);
        if (!user) {
            return res.redirect('/session/login');
        }
        res.render('sessions/profile', user.toObject());
    } catch (error) {
        console.error('Error al obtener la información del perfil:', error);
        res.status(500).send('Error interno del servidor');
    }
};

export const current = (req, res) => {
    try {
        const userDto = userToDto(req.user);
        res.render('sessions/current', { user: userDto });
    } catch (error) {
        console.error('Error al obtener la información del usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
};

export const getAllUsers = async (req, res) => {
    try{
        const users = await UserService.getAllUsers();
        const simplifiedUsers = users.map(user => userToDto(user));
        res.render('users', { users: simplifiedUsers });
    }catch (error){
        console.error('Error al obtener los usuarios:', error);
        res.status(500).json({ error: 'Error al obtener los usuarios' });
    }

};

export const deleteInactiveUsers = async (req, res) => {
    try{
        const users = await UserService.deleteInactiveUsers();
        res.json(users);
    }catch (error){
        console.error('Error al eliminar los usuarios inactivos:', error);
        res.status(500).json({ error: 'Error al eliminar los usuarios inactivos' });
    }
}

export const deleteUser = async (req, res) => {
    const userId = req.params.uid;
    const result = await UserService.deleteUser(userId);
    if(result){
        res.json({ message: `Usuario con ID: ${userId} ha sido eliminado.` });
    } else {
        res.status(404).json({ error: 'Usuario no encontrado para eliminar' });
    }
};

export const updateUser = async (req, res) => {
    const userId = req.params.uid;
    const newRole = req.body.role;
    const result = await UserService.updateUser(userId, { role: newRole });
    if(result){
        res.json({ message: 'Usuario actualizado exitosamente.' });
    } else {
        res.status(404).json({ error: 'Usuario no encontrado para actualizar' });
    }
};