import { Router } from 'express';
import { weatherRouter } from './weather.router';

export const rootRouter = Router();

rootRouter.use('/weather', weatherRouter);
