import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const connectDB = async function(){
  try {
    const mongoURI = `${process.env.MONGO_URL}`;    
    const conn = await mongoose.connect(mongoURI);
  } catch (error) {
    process.exit(1); 
  }
};
export { connectDB, mongoose }; 