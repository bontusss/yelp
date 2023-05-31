import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config({ path: './config.env' });

const DB = process.env.MONGO_URl;

const connectDB = () => {
  console.log('connecting to DB..');
  mongoose.connect('mongodb+srv://bontus:bontusfavor1994@cluster0.izncrp4.mongodb.net/gudbye?retryWrites=true&w=majority');
  mongoose.connection.on('connected', function () {
    console.log('Database is connected');
  });
  mongoose.connection.on('error', function (err) {
    console.error(`Error: ${err.name}, ${err.message}`);
  });
  mongoose.connection.on('disconnected', function () {
    console.warn(`Warn: Database is disconnected`);
  });

  //   process.on('SIGINT', function () {
  //     mongoose.connection.close( function (){
  //       console.log('Database is disconnect because of app termination')
  //       return true
  //     });
  //   });
};

export default connectDB;
