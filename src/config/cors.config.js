/**
 * CORS configuration options for the Express application.
 * Defines allowed origins, methods, headers, and credential handling.
 */
const corsOptions = {
  origin: "https://hangout-qmom.onrender.com", // Allow only this origin
  // origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

export default corsOptions;
