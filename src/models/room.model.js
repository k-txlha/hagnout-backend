import mongoose from "mongoose";
import { messageSchema } from "./message.model.js";

/**
 * Schema for room members — stores username and a reference to the User document.
 */
const memberSchema = new mongoose.Schema({
  username: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

/**
 * Schema for music tracks stored in a room's playlist.
 */
const trackSchema = new mongoose.Schema({
  trackName: String,
  trackUrl: {
    type: String,
  },
});

/**
 * Mongoose schema for the Room collection.
 * Rooms contain members, conversations (embedded messages), and music tracks.
 */
const roomSchema = new mongoose.Schema({
  roomName: {
    type: String,
    required: true,
    unique: true,
  },
  roomId: {
    type: String,
    required: true,
    unique: true,
  },
  roomCover: {
    type: String,
  },
  conversations: [messageSchema],
  members: [memberSchema],
  roomAdmin: {
    type: String,
    required: true,
  },
  tracks: [trackSchema],
});

const Room = mongoose.model("Room", roomSchema);

export default Room;
