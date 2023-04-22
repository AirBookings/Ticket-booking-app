import express, { urlencoded } from 'express'
import 'express-async-errors'
import { json } from "body-parser";
import cookieSession from 'cookie-session';

import { curentUserRouter } from './routes/currentuser';
import { signupRouter } from './routes/signup';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { errorHandler, NotFoundError } from '@uc-tickets/common';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(urlencoded({ extended: false}))
app.use(cookieSession({
    signed: false, // disabled encryption
    // secure: process.env.NODE_ENV !== 'test', // must be on https connection
    secure: false,
}))

app.use(curentUserRouter)
app.use(signupRouter)
app.use(signinRouter)
app.use(signoutRouter)

app.all('*', async (req, res) => {
    throw new NotFoundError();
})

app.use(errorHandler)

export { app }