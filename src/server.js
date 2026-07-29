import http from "node:http";
import app from "./app.js";
import initializeSocketServer from "./sockets/socket.setup.js";
import consumeEvents from "./services/rabbitmq.consumer.js";

/**
 * HTTP server instance created from the Express app.
 */
const server = http.createServer(app);

/**
 * Socket.IO server instance, attached to the HTTP server.
 */
const io = initializeSocketServer(server);

// Start the RabbitMQ consumer to process incoming events
consumeEvents(io);

export { app, server, io };
