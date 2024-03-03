
import ticketDao from '../dao/ticketsDao.js';
import ticketRepository from '../services/tickets.repository.js';


const TicketService = new ticketRepository(new ticketDao())

export const viewTicket = async (req, res) => {
    const ticket = await TicketService.getTicketById(req.params.tid);
    if (ticket) {
        res.render('ticket', { ticket: ticket.toObject() });
    } else {
        res.status(404).render('error', { error: 'Ticket no encontrado' });
    }
}