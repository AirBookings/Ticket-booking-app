import request from 'supertest'

import { app } from '../../app'

it('returns a 201 on successful signup', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password',
        })
        .expect(201);
})

it('returns a 400 with an invalid email ', () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'testded',
            password: 'password',
        })
        .expect(400);
})

it('returns a 400 with an invalid password ', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@tes',
            password: 'p',
        })
        .expect(400);
})

it('returns a 400 with missing email and password ', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'dm@gm.com'
        })
        .expect(400);
    
    await request(app)
        .post('/api/users/signup')
        .send({
            password: 'mkdmakd',
        })
        .expect(400);
})

it('disallows duplicate emails', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'uche@gmail.com',
            password: 'password'
        })
        .expect(201)
    
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'uche@gmail.com',
            password: 'password'
        })
        .expect(400)
})

it('sets a cookie after successful signup', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'uche@gmail.com',
            password: 'password'
        })
        .expect(201)

        expect(response.get('Set-Cookie')).toBeDefined();
})