import request from 'supertest'
import { app } from '../../app'
import assert from 'assert'

it('fails when an email that does not exist is supplied ', async () => {
    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'man@man.dev',
            password: 'password'
        })
        .expect(400)
})

it('fails when an incorrect password is supplied', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'man@g.com',
            password: 'pass',
        })
        .expect(201)
    
    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'man@g.com',
            password: 'pa',
        })
        .expect(400)
})

it('send cookie after successful signin', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'man@g.com',
            password: 'pass',
        })
        .expect(201)
    
        const user = {
            email: 'man@g.com',
            password: 'pass',
        }

    const response = await request(app)
        .post('/api/users/signin')
        .send(user)
        .expect(200)
        
        expect(response.get('Set-Cookie')).toBeDefined()

        assert.strictEqual(response.body.email, user.email)
})