export default class TicketRepository {
    constructor(dao) {
        this.dao = dao
    }

    createTicket = async (purchaseData) => { return await this.dao.createTicket(purchaseData) }


}