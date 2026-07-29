import { Server } from "socket.io";
import { broadcastMessage } from "./message.socket.js";
import publishEvent from "../services/rabbitmq.publisher.js";

/**
 * In-memory store tracking the currently playing song for each room.
 * Keyed by roomId with track info as the value.
 *
 * @type {Object.<string, {trackName: string, trackURL: string, duration: number, fullDuration: number}>}
 */
const activeRoomTracks = {};

/**
 * Initializes the Socket.IO server and registers all event handlers.
 *
 * @param {import('http').Server} httpServer - The HTTP server instance to attach Socket.IO to.
 * @returns {import('socket.io').Server} The configured Socket.IO server instance.
 */
const initializeSocketServer = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      allowedHeaders: ["my-custom-header"],
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`a user connected`, socket.id);

    socket.on("join_room", ({ roomId, username }) => {
      socket.join(roomId);
      console.log(`👤 ${username} joined room: ${roomId}`);

      socket.to(roomId).emit("user_joined", { username, roomId });

      if (activeRoomTracks[roomId] && activeRoomTracks[roomId].trackName) {
        socket.emit("running_track", activeRoomTracks[roomId]);
      }
    });

    socket.on("send-message", ({ roomId, message, username }) => {
      console.log(
        `💬 Message from ${username} in ${roomId}: ${message.messageContent}`
      );
      broadcastMessage(roomId, message, username);
    });

    socket.on("song_change", async (data) => {
      activeRoomTracks[data.roomId] = {
        trackName: data.trackName,
        trackURL: data.trackUrl,
        duration: 0,
        fullDuration: 0,
      };
      await publishEvent("song_change", data);
    });

    socket.on("get_song_updates", (track) => {
      const { roomId, trackName, trackURL, duration, fullDuration } = track;

      activeRoomTracks[roomId] = {
        trackName,
        trackURL,
        duration,
        fullDuration,
      };

      if (activeRoomTracks[roomId].duration === activeRoomTracks[roomId].fullDuration) {
        activeRoomTracks[roomId] = {};
      }
    });

    socket.on("leave_room", (roomId) => {
      socket.leave(roomId);
      socket.removeAllListeners("running_track");
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });

  return io;
};

export default initializeSocketServer;
