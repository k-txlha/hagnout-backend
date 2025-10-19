// importing required modules
import mongoose from "mongoose";
import bodyParser from 'body-parser';
import cors from "cors";
import express from 'express'
import dotenv from "dotenv";
import { app, server } from "./server.js";
import authenticateToken from "./middleware/auth.js";
import cookieParser from "cookie-parser";

dotenv.config();

// getting routes
import userRouter from './routes/users/userRoutes.js';
import roomRouter from './routes/rooms/roomRoute.js';
import messageRouter from "./routes/messages/messages.js";

// settings cors options 
const corsOptions = {
    origin: 'https://hangout-qmom.onrender.com', // allow only this origin
    // origin: "http://localhost:3000",
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
}

// setting up middlewares
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.use(cors(corsOptions));
app.options('*', cors());

// use routes
app.use('/users', userRouter);
app.use('/rooms', authenticateToken,  roomRouter);
app.use('/messages', authenticateToken,  messageRouter);

try { 
    mongoose.connect(process.env.URI)
        .then(() => {
            server.listen(process.env.PORT, () => {
                console.log(`server started on ${process.env.PORT}`);
            })
        }).catch((error) => {
            console.log("server could not be started", error);
        })
} catch (error) {
    console.log(error);
}
