import express from 'express';
import connectDB from './lib/db.js';
import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.routes.js'
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { app, server } from './lib/socket.js';
import path from 'path';

dotenv.config();
const port =  process.env.PORT;
const __dirname = path.resolve();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET" , "POST" , "PUT"]
}))
app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use("/api/auth" , authRoutes);
app.use("/api/messages" , messageRoutes);


if(process.env.NODE_ENV ==="Production"){
    app.use(express.static(path.join(__dirname, "../client/dist")));
    app.get("*" , (req, res) =>{
        res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
    })

}

server.listen(port, () =>{
    console.log(`App is listening to port ${port}`)
    connectDB();
})