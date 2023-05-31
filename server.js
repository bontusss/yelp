import * as dotenv from 'dotenv';
import connectDB from './utils/connectDB';

dotenv.config({ path: './config.env' });

// handle failed synchronoous requests
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  process.exit(1);
});

import app from './app';
// connnect database
connectDB();

// Start server
const port = Number(process.env.PORT) || 3000;
const server = app.listen(port, '127.0.0.1', () => {
  console.log(`Server is up and running on ${port} 🎈`);
});

// handle failed promises
process.on('unhandledRejection', (err) => {
  // console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
