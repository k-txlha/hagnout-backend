import express from "express";
import {
  createRoom,
  searchRooms,
  joinRoom,
  deleteRoom,
  leaveRoom,
  fetchRooms,
  addTrackToRoom,
  fetchTracks,
  fetchRoomMembers,
} from "../controllers/room.controller.js";

const roomRouter = express.Router();

roomRouter.post("/create-room", createRoom);
roomRouter.post("/search-room", searchRooms);
roomRouter.post("/join-room", joinRoom);
roomRouter.delete("/delete-room/:id", deleteRoom);
roomRouter.put("/leave-room", leaveRoom);
roomRouter.post("/fetch-rooms", fetchRooms);
roomRouter.post("/add-track", addTrackToRoom);
roomRouter.get("/fetch-tracks/:roomId", fetchTracks);
roomRouter.post("/fetch-members", fetchRoomMembers);

export default roomRouter;
