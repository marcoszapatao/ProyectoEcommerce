export default class UserRepository {
    constructor(dao) {
        this.dao = dao
    }

    getUserById = async (id) => { return await this.dao.getUserById(id) }

}