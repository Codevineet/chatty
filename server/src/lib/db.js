import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () =>{

    try {
       const conn = await mongoose.connect(process.env.MONGODB_URI);
       console.log(`Database connected : ${conn.connection.host}`)
    } catch (error) {
        console.log(`Database Connection Error : ${error}`);
    }
}


export default connectDB;