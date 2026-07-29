import Room from "../models/room.model.js";
import User from "../models/user.model.js";
import redisClient from "../config/redis.config.js";

/**
 * Retrieves all messages for a room by its ID.
 * Uses Redis caching — returns cached conversations if available,
 * otherwise fetches from MongoDB and populates the cache.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getMessages = async (req, res) => {
  const id = req.params.id;
  console.log(id);

  const cachedConversations = await redisClient.get(id);

  if (cachedConversations) {
    const conversationsArray = JSON.parse(cachedConversations);
    return res.json(conversationsArray);
  }

  try {
    const room = await Room.findById(id);

    if (!room) {
      return res.status(404).send({ message: "Room not found" });
    }

    if (room.conversations) {
      const conversations = [];

      for (const conversation of room.conversations) {
        const user = await User.findById(conversation.senderId.toString());

        if (user) {
          conversations.push({
            messageContent: conversation.messageContent,
            fileUrl: conversation.fileUrl,
            timestamp: conversation.createdAt,
            username: user.username,
            profilePic: user.profilePic,
          });
        }
      }

      await redisClient.set(id, JSON.stringify(conversations));

      return res.send(conversations);
    } else {
      return res.send([]);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal server error" });
  }
};

/**
 * Sends a message to a room.
 * Saves the message to MongoDB and updates the Redis cache if present.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const sendMessage = async (req, res) => {
  const messageContent = req.body.messageContent;
  const { senderId } = req.body;
  const { roomId } = req.body;
  const { fileUrl } = req.body;

  try {
    const room = await Room.findById(roomId);
    const user = await User.findById(senderId);

    if (!room) {
      return res.status(404).send({ message: "Room not found" });
    }

    // Update Redis cache if it exists
    const cachedMessages = await redisClient.get(roomId);

    if (cachedMessages) {
      const messageArray = JSON.parse(cachedMessages);
      const newMessage = {
        messageContent,
        fileUrl,
        timestamp: Date.now(),
        username: user.username,
        profilePic: user.profilePic,
      };
      messageArray.push(newMessage);
      await redisClient.set(roomId, JSON.stringify(messageArray));
    }

    room.conversations.push({ messageContent, fileUrl, senderId, roomId });

    await room.save();

    res.status(201).send({ message: "Message sent" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
};
