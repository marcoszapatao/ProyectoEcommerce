export default class TicketRepository {
    constructor(dao) {
        this.dao = dao
    }

    createTicket = async (purchaseData) => { return await this.dao.createTicket(purchaseData) }
    getTicketById = async (id) => { return await this.dao.getTicketById(id) }


}