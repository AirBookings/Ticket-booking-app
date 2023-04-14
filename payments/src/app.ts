import express, { urlencoded } from 'express'
import 'express-async-errors'
import { json } from "body-parser";
import cookieSession from 'cookie-session';
import { currentUser, errorHandler, NotFoundError } from '@uc-tickets/common';
import { createChargeRouter } from './routes/new';


const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(urlencoded({ extended: false}))
app.use(cookieSession({
    signed: false, // disabled encryption
    secure: process.env.NODE_ENV !== 'test', // must be on https connection
}))
app.use(currentUser)
app.use(createChargeRouter)

app.all('*', async (req, res) => {
    throw new NotFoundError();
})

app.use(errorHandler)

export { app }