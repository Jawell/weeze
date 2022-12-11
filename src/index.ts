import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';

import { postgresConnection } from './connections/postgres.connection';
import { rootRouter } from './routes';

postgresConnection
  .initialize()
  .then(() => {
    console.info('Database has been initialized!');
  })
  .catch(() => {
    console.error('Error during Database initialization');
  });

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/v1', rootRouter);

const APP_PORT = 3000;

app.listen(APP_PORT, () => {
  console.info(`App was started, port: ${APP_PORT}`);
});
