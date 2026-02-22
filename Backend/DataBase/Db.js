import mongoose from 'mongoose';

(async function(){
  try {
    const mongoURI = process.env.MONGO_URI ;
    
    const conn = await mongoose.connect(mongoURI);
    
  } catch (error) {
    process.exit(1); 
  }
})();
export default mongoose; 