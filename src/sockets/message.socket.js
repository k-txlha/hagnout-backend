import User from "../models/user.model.js";
import { io } from "../server.js";

/**
 * Broadcasts a chat message to all users in a given Socket.IO room.
 * Enriches the message with the sender's profile picture and a timestamp.
 *
 * @param {string} roomId - The ID of the room to broadcast to.
 * @param {Object} message - The message object containing messageContent and fileUrl.
 * @param {string} username - The username of the message sender.
 * @returns {Promise<void>}
 */
export const broadcastMessage = async (roomId, message, username) => {
  console.log(message);

  const { messageContent, fileUrl } = message;
  const user = await User.findOne({ username: username });

  const currentDate = new Date();
  const timestamp =
    "Last Sync: " +
    currentDate.getDate() +
    "/" +
    (currentDate.getMonth() + 1) +
    "/" +
    currentDate.getFullYear() +
    " @ " +
    currentDate.getHours() +
    ":" +
    currentDate.getMinutes() +
    ":" +
    currentDate.getSeconds();

  io.to(roomId).emit("receive-message", {
    messageContent: messageContent,
    fileUrl: fileUrl,
    username: username,
    profilePic: user.profilePic,
    timestamp: timestamp,
  });
};
