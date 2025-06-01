import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './config/index';

process.on('uncaughtException', error => {
   // errorlogger.error(error);
   console.log(error);
   process.exit(1);
});

let server: Server;

async function connection() {
   try {
      await mongoose.connect(config.database_url as string);
      console.log('DB is connected succesfully ....!!');

      server = app.listen(config.port, () => {
         console.log(`Application is listening on port ${config.port}`);
      });
   } catch (err) {
      console.log('server errooooooooooorrrrr', err);
      // errorlogger.error(err);
   }

   process.on('unhandledRejection', error => {
      if (server) {
         server.close(() => {
            console.log(error);
            // errorlogger.error(error);
            process.exit(1);
         });
      } else {
         process.exit(1);
      }
   });
}
connection();
