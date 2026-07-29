import mongoose from "mongoose";

/**
 * Mongoose schema for embedded message documents.
 * Messages are stored as subdocuments within Room conversations.
 */
export const messageSchema = new mongoose.Schema(
  {
    messageContent: {
      type: String,
    },
    fileUrl: {
      type: String,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
