import express, { urlencoded } from 'express'
import 'express-async-errors'
import { json } from "body-parser";
import cookieSession from 'cookie-session';
import { currentUser, errorHandler, NotFoundError } from '@uc-tickets/common';

import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { indexTicketRouter } from './routes/index';
import { updatesTicketRouter } from './routes/update';


const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(urlencoded({ extended: false}))
app.use(cookieSession({
    signed: false, // disabled encryption
    secure: process.env.NODE_ENV !== 'test', // must be on https connection
}))
app.use(currentUser)

app.use(createTicketRouter)
app.use(showTicketRouter)
app.use(indexTicketRouter)
app.use(updatesTicketRouter)



app.all('*', async (req, res) => {
    throw new NotFoundError();
})

app.use(errorHandler)

export { app }