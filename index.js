import dotenv from "dotenv";

// Load environment variables before any other imports
dotenv.config();

import { server } from "./src/server.js";
import connectDatabase from "./src/config/database.config.js";

const PORT = process.env.PORT || 5000;

/**
 * Application entry point.
 * Connects to the database and starts the HTTP server.
 */
try {
  connectDatabase()
    .then(() => {
      server.listen(PORT, () => {
        console.log(`🚀 Server started on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.log("server could not be started", error);
    });
} catch (error) {
  console.log(error);
}
