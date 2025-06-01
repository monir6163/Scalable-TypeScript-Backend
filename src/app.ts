import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import hpp from 'hpp';
import { StatusCodes } from 'http-status-codes';
import morgan from 'morgan';
import xss from 'xss-clean';
import { globalErrorHandler } from './app/middleware/globalErrorHandler';
import routes from './app/routes';
import config from './config';
import { sendResponse } from './shared/sendResponse';

const app: Application = express();

// cors
app.use(
   cors({
      origin: config.cors_origin || '*',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
   })
);
// cockie perser
app.use(cookieParser());

// body perser
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));

// middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(xss());
app.use(mongoSanitize());
app.use(hpp());
app.disable('x-powered-by');
app.use(morgan('dev'));

// use routes
app.use('/api/v1', routes);

// globalErrorHandler
app.use(globalErrorHandler);

// health check
app.get('/', (req, res) => {
   const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
   sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Server is running',
      data: {
         message: 'Server is running',
         author: 'Md. Monir Hossain',
         version: '1.0.0',
         host: req.hostname,
         protocol: req.protocol,
         ip: ip,
         time: new Date().toISOString(),
      },
   });
   res.end();
});

//handle not found
app.use((req: Request, res: Response, next: NextFunction) => {
   res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: 'Not Found',
      errorMessages: [
         {
            path: req.originalUrl,
            message: 'API Not Found',
         },
      ],
   });
   next();
});

export default app;
