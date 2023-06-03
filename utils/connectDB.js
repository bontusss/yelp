import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config({ path: './config.env' });

const DB = process.env.MONGO_l;

const connectDB = () => {
  console.log('connecting to DB..');
  // @ts-ignore
  mongoose.connect(DB as string);
  mongoose.connection.on('connected', function () {
    console.log('Database is connected');
  });
  mongoose.connection.on('error', function (err) {
    console.error(`Error: ${err.name}, ${err.message}`);
  });
  mongoose.connection.on('disconnected', function () {
    console.warn(`Warn: Database is disconnected`);
  });
};

export default connectDB;
