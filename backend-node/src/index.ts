import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { DbConnector } from './lib/db';
import { Logger } from './utils/logger';


DbConnector.connect({ host: process.env.DB_URL as string });

const app = express();
const PORT = process.env.PORT;
const logger = Logger.getInstance();

app.use(cookieParser());
app.use(express.json());

app.use(cors(
  {
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://192.168.0.111:3001'], // Be more specific in production
    credentials: true, //access-control-allow-credentials:true (make this true if client make request with credential)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  }
));

// app.use('/otp', otpRouter);



const server = app.listen(PORT, async ()=> {
  // console.log(`server started at port ${PORT}`);
  logger.info(`server started at port ${PORT}`)
});

// WebSocketService.getInstance().initialize(server);