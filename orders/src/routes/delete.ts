import { NotAuthorizedError, NotFoundError, requireAuth, validateRequest } from '@uc-tickets/common';
import express, { Request, Response } from 'express'
import { param } from 'express-validator';
import mongoose from 'mongoose';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { Order, OrderStatus } from '../models/order';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete('/api/orders/:orderId', requireAuth,
[ param('orderId')
.not()
.isEmpty()
.custom((input:string) => mongoose.Types.ObjectId.isValid(input))
.withMessage('orderId must be provided')
],
validateRequest,
 async (req: Request, res: Response) => {
    const { orderId } = req.params
    const order = await Order.findById(orderId).populate('ticket')

    if (!order) {
        throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled
    await order.save();

    // publishing an event saying this was cancelled
    new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        ticket: {
            id: order.ticket.id
        },
        version: order.ticket.version
    })
    
    res.status(204).send(order)
})

export { router as deleteOrderRouter }