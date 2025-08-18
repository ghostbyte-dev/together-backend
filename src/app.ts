import 'reflect-metadata';
import { errorHandlerMiddleware } from './middleware/errorHandler';
import { NextFunction, Request, Response } from 'express';
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use('/uploads', express.static('uploads'));

app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.is('application/json')) {
    console.log('application json');
    express.json()(req, res, next);
  } else {
    console.log(req.url);
    console.log('not application json');
    next();
  }
});

const userRoute = require('./routes/user.route');
app.use('/user', userRoute);

const authRoute = require('./routes/auth.route');
app.use('/auth', authRoute);

const communityRoute = require('./routes/community.route');
app.use('/community', communityRoute);

const calendarRoute = require('./routes/calendar.route');
app.use('/calendar', calendarRoute);

const shoppinglistRoute = require('./routes/shoppinglist.route');
app.use('/shoppinglist', shoppinglistRoute);

const debtRoute = require('./routes/debt.route');
app.use('/debt', debtRoute);

const todoRoute = require('./routes/todo.route');
app.use('/todos', todoRoute);

const feedbackRoute = require('./routes/feedback.route');
app.use('/feedback', feedbackRoute);

app.use(errorHandlerMiddleware);

app.listen(3000, () => {
  console.log('App listening on Port 3000');
});
