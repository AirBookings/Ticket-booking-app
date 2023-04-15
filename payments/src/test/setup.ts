import { MongoMemoryServer }from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'
require('dotenv').config()
jest.mock('../nats-wrapper')

declare global {
    var signin: () => string[];
}

let mongo: any
beforeAll(async () => {

    mongoose.set('strictQuery', true)
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri, {});
})

beforeEach(async () => {
    jest.clearAllMocks()
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
})

afterAll(async () => {
    if (mongo) {
        await mongo.stop();
    }
    await mongoose.connection.close();
});

// signin function that returns cookie
global.signin = () => {

    // Build a Jwt payload. { id, email }
    const payload = {
        id: new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com'
    }

    //create JWT
    const token = jwt.sign(payload, process.env.JWT_KEY!)

    // Build session Object. { jwt: MY_JWT }
    const session = { jwt: token }

    //Turn that session into JSON
    const sessionJSON = JSON.stringify(session)

    //Take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');

    // return a string thats the cookie will the encoded data

    return [`session=${base64}`]; 
}