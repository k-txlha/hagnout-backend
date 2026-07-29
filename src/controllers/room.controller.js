import Room from "../models/room.model.js";
import User from "../models/user.model.js";
import generateRandomString from "../utils/random-string.util.js";

const ROOM_ID_CHARSET =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const ROOM_ID_LENGTH = 32;

let roomCount = 1;

/**
 * Creates a new room with a unique room ID.
 * The requesting user becomes the room admin and first member.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const createRoom = async (req, res) => {
  const roomName = req.body.roomName;
  const roomId =
    generateRandomString(ROOM_ID_LENGTH, ROOM_ID_CHARSET) + roomCount;
  const roomAdmin = req.body.roomAdmin;

  const userId = await User.findOne({ username: roomAdmin });
  const existingRoom = await Room.findOne({ roomName: roomName });

  if (existingRoom) {
    console.log("this room already exist");
    return res.status(409).send({
      message: "room already exist",
    });
  } else {
    const newRoom = new Room({
      roomName: roomName,
      roomId: roomId,
      roomAdmin: roomAdmin,
    });

    newRoom.members.push({ username: roomAdmin, userId: userId._id });

    newRoom.save().then(() => {
      res.status(201).send({
        message: "room has been created",
        id: newRoom._id,
        room_name: roomName,
        room_id: roomId,
        roomAdmin: roomAdmin,
      });
    });
  }

  roomCount++;
};

/**
 * Searches for rooms whose name matches the provided prefix (case-insensitive).
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const searchRooms = async (req, res) => {
  const roomName = req.body.roomName;

  const rooms = await Room.find({
    roomName: { $regex: "^" + roomName, $options: "i" },
  });

  if (rooms.length != 0) {
    console.log(rooms);
    res.send(rooms);
  } else {
    console.log("No rooms found");
    return res.status(409).send({
      message: "No room found",
    });
  }
};

/**
 * Adds a user to a room's member list.
 * Returns 403 if the user is already a member.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const joinRoom = async (req, res) => {
  const roomId = req.body.roomId;
  const username = req.body.username;
  const { userId } = req.body;

  const room = await Room.findOne({ roomId: roomId });

  const existingMember = room.members.find((u) => u.username === username);

  if (existingMember === undefined) {
    room.members.push({ username, userId });
    room.save();
    return res.status(200).send({
      message: "You are now member of " + room.roomName,
    });
  } else {
    return res.status(403).send({
      message: "You are already a member of this room",
    });
  }
};

/**
 * Deletes a room by its room ID (from URL params).
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const deleteRoom = async (req, res) => {
  console.log("delete controller is here!!");

  Room.deleteOne({ roomId: req.params.id }).then(() => {
    return res.send({
      message: "Room has been successfully deleted",
    });
  });
};

/**
 * Removes a user from a room's member list.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const leaveRoom = async (req, res) => {
  const username = req.body.username;
  const roomId = req.body.roomId;

  const room = await Room.findById(roomId);

  room.members.remove({ username: username });

  room.save().then(() => {
    res.send({
      message: "you have left the room",
    });
  });
};

/**
 * Fetches all rooms that the specified user is a member of.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const fetchRooms = async (req, res) => {
  const username = req.body.username;
  const joinedRooms = [];

  const rooms = await Room.find({});

  rooms.map((room) => {
    if (room.members.find((u) => u.username === username)) {
      joinedRooms.push(room);
    }
  });

  res.send(joinedRooms);
};

/**
 * Fetches the music tracks playlist for a given room.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const fetchTracks = async (req, res) => {
  const { roomId } = req.params;

  try {
    const room = await Room.findById(roomId);

    if (room.tracks) {
      const tracks = [];

      for (const track of room.tracks) {
        tracks.push({ trackUrl: track.trackUrl, trackName: track.trackName });
      }

      return res.send(tracks);
    }

    return res.send([]);
  } catch (error) {
    return res.status(500).send({ message: "Internal server error" });
  }
};

/**
 * Adds a music track to a room's playlist.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const addTrackToRoom = async (req, res) => {
  const roomId = req.body.roomId;
  const { trackName } = req.body;
  const { trackUrl } = req.body;

  const room = await Room.findById(roomId);

  room.tracks.push({ trackName, trackUrl });
  room.save();

  return res.status(200).send({
    message: "Track has been added",
  });
};

/**
 * Fetches the member list (username + profile picture) for a given room.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const fetchRoomMembers = async (req, res) => {
  const roomId = req.body.roomid;

  try {
    const room = await Room.findById(roomId);
    const membersInfo = [];

    for (const member of room.members) {
      const user = await User.find({ username: member.username });
      membersInfo.push({
        username: user[0].username,
        profilePic: user[0].profilePic,
      });
    }

    return res.send(membersInfo);
  } catch (error) {
    res.send({ "Something went wrong": error });
  }
};
