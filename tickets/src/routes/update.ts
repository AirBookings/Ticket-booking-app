import { BadRequestError, NotAuthorizedError, NotFoundError, requireAuth, validateRequest } from '@uc-tickets/common';
import express, { Request, Response } from 'express'
import { body } from 'express-validator';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { Ticket } from '../model/ticket'
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();


router.put('/api/tickets/:id', requireAuth,
    [ body('title').not().isEmpty().withMessage('Title is required'),
      body('price').isFloat({ gt: 0}).withMessage('Price must be greater than zero')], validateRequest,
    async (req: Request, res: Response) => {

    const ticket = await Ticket.findById(req.params.id)

    if (!ticket) {
        throw new NotFoundError()
    }

    if (ticket.orderId) {
        throw new BadRequestError("Cannot edit a reserved ticket");
        
    }

    if (ticket.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }

    const { title, price } = req.body

    let updateTicket = ticket.set({ title, price })
    await updateTicket.save()

    await new TicketUpdatedPublisher(natsWrapper.client).publish({
        id: updateTicket.id,
        title: updateTicket.title,
        price: updateTicket.price,
        userId: updateTicket.userId,
        version: ticket.version
    })
    
    res.send(ticket)
})

export { router as updatesTicketRouter }