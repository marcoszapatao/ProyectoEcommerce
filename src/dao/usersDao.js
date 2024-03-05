import UsersModel from './models/user.model.js'

export default class User {
    getUserById = async (id) => { return await UsersModel.findById(id) }
    getAllUsers = async () => { return await UsersModel.find() }
    updateLastLogin = async (id) => { return await UsersModel.findByIdAndUpdate(id, { lastActive: new Date() }) }
    deleteInactiveUsers = async () => { return await UsersModel.deleteMany({ lastActive: { $lt: new Date(Date.now() - 1000 * 60 * 30) } }) }
    deleteUser = async (id) => { return await UsersModel.findByIdAndDelete(id) }
    updateUser = async (id, userData) => { return await UsersModel.findByIdAndUpdate(id, userData, { new: true }) }
}