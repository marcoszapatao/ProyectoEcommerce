export default class UserRepository {
    constructor(dao) {
        this.dao = dao
    }

    getUserById = async (id) => { return await this.dao.getUserById(id) }
    getAllUsers = async () => { return await this.dao.getAllUsers() }
    updateLastLogin = async (id) => { return await this.dao.updateLastLogin(id) }
    deleteInactiveUsers = async () => { return await this.dao.deleteInactiveUsers() }

}