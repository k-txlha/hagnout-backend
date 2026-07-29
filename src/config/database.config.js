import mongoose from "mongoose";

/**
 * Establishes a connection to the MongoDB database using the
 * connection URI from environment variables.
 * @returns {Promise<void>}
 */
const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDatabase;
