import TicketsModel from './models/tickets.model.js'

export default class Ticket {
    createTicket = async (purchaseData) => { 
        try {
            const ticketCode = 'TKT-' + Date.now();

            const newTicket = new TicketsModel({
                code: ticketCode,
                purchase_datetime: new Date(),
                amount: purchaseData.amount,
                purchaser: purchaseData.purchaser
            });

            await newTicket.save();
            console.log("Ticket creado con éxito.");
            return newTicket;
        } catch (error) {
            throw error;
        }
    }
    getTicketById = async (id) => { return await TicketsModel.findById(id) }
}