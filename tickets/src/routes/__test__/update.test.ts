import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../app'
import { natsWrapper } from '../../nats-wrapper'
import { Ticket } from '../../model/ticket'

it('returns a 404 if provided id does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'dka',
            price: 33
        })
        .expect(404)
})

it('returns a 401 if the user is not authenticated', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
    .put(`/api/tickets/${id}`)
    .send({
        title: 'dka',
        price: 33
    })
    .expect(401)
})

it('returns 401 if the user does not own the ticket', async () => {

    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
        title: 'making',
        price: 10,
    })
    .expect(201)


    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
        title: 'dka',
        price: 30,
        // userId
    })
    .expect(401)
    
})

it('returns a 400 if the user provides an invalid title of price', async () => {
    const cookie = global.signin()

    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
        title: 'making',
        price: 10,
    })
    .expect(201)

    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
        title: 'dka',
    })
    .expect(400)
})

it('updates the tickets provided the input is valid ', async () => {
    const cookie = global.signin()

    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
        title: 'making',
        price: 100,
    })
    .expect(201)

    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
        title: 'new',
        price: 200
    })
    .expect(200)

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()
    
    expect(ticketResponse.body.title).toEqual('new')
    expect(ticketResponse.body.price).toEqual(200)
})

it('publishes an event', async () => {
    const cookie = global.signin()

    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
        title: 'making',
        price: 100,
    })
    .expect(201)

    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
        title: 'new',
        price: 200
    })
    .expect(200)

    expect(natsWrapper.client.publish).toHaveBeenCalled()
})

it('rejects updates if the ticket is reserved', async() => {
    const cookie = global.signin()

    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
        title: 'making',
        price: 100,
    })
    .expect(201)

    const ticket = await Ticket.findById(response.body.id)
    ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString()})
    await ticket!.save()

    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
        title: 'new',
        price: 200
    })
    .expect(400)
})