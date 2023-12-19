import UsersModel from './models/user.model.js'

export default class User {
    getUserById = async (id) => { return await UsersModel.findById(id) }
}