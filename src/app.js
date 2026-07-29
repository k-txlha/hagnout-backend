import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";

import corsOptions from "./config/cors.config.js";
import authenticateToken from "./middlewares/auth.middleware.js";
import userRouter from "./routes/user.routes.js";
import roomRouter from "./routes/room.routes.js";
import messageRouter from "./routes/message.routes.js";

/**
 * Express application instance.
 * Configures all middlewares and mounts route handlers.
 */
const app = express();

// --- Body Parsing Middlewares ---
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// --- CORS Middleware ---
app.use(cors(corsOptions));
app.options("*", cors());

// --- Route Handlers ---
app.use("/users", userRouter);
app.use("/rooms", authenticateToken, roomRouter);
app.use("/messages", authenticateToken, messageRouter);

export default app;
