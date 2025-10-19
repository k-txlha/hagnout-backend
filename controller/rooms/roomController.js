import roomModel from "../../models/rooms/roomModel.js";
import userModel from "../../models/users/userModel.js";

var roomCount = 1;
// *********** Create room controller ***********
function randomString(length, chars) {
  var result = "";
  for (var i = length; i > 0; --i)
  result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

// ****************** Ceate Room Controller ******************
export const createRoomController = async (request, response) => {
  const roomName = request.body.roomName;
  const roomId =
    randomString(
      32,
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    ) + roomCount;
  const roomAdmin = request.body.roomAdmin;

  const userId = await userModel.findOne({ username: roomAdmin });
  const room = await roomModel.findOne({ roomName: roomName });

  if (room) {
    console.log("this room already exist");
    return response.status(409).send({
      message: "room already exist",
    });
  } else {
    const newRoom = new roomModel({
      roomName: roomName,
      roomId: roomId,
      roomAdmin: roomAdmin,
    });
    newRoom.members.push({ username: roomAdmin, userId: userId._id });
    newRoom.save().then(() => {
      response.status(201).send({
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

// *********** Search room controller ***********
export const searchRoomsController = async (request, response) => {
  const roomName = request.body.roomName;
  // Check if room is present in the db
  const room = await roomModel.find({
    roomName: { $regex: "^" + roomName, $options: "i" },
  });

  if (room.length != 0) {
    console.log(room);
    response.send(room);
  } else {
    console.log("No rooms found");
    return response.status(409).send({
      message: "No room found",
    });
  }
};
// *********** Join room controller ***********
export const joinRoomController = async (request, response) => {
  const roomId = request.body.roomId;
  const username = request.body.username;
  const { userId } = request.body;

  const room = await roomModel.findOne({ roomId: roomId });

  const user = room.members.find((u) => u.username === username);
  if (user === undefined) {
    room.members.push({ username, userId });
    room.save();
    return response.status(200).send({
      message: "You are now member of " + room.roomName,
    });
  } else {
    return response.status(403).send({
      message: "You are already a member of this room",
    });
  }
};
// *********** Delete room controller ***********
export const deleteRoomController = async (request, response) => {
  console.log("delete controller is here!!");
  roomModel.deleteOne({ roomId: request.params.id }).then(() => {
    return response.send({
      message: "Room has been successfully deleted",
    });
  });
};
// *********** Leave room controller ***********
export const leaveRoomController = async (request, response) => {
  const username = request.body.username;
  const roomId = request.body.roomId;

  const room = await roomModel.findById(roomId);
  // room.members.pop({username: username});
  room.members.remove({ username: username });
  room.save().then(() => {
    response.send({
      message: "you have left the room",
    });
  });
};
// *********** Fetch room controller ***********
export const fetchRoomsController = async (request, response) => {
  const username = request.body.username;
  var joinedRooms = [];

  const rooms = await roomModel.find({});
  rooms.map((room) => {
    if (room.members.find((u) => u.username === username)) {
      joinedRooms.push(room);
    }
  });

  response.send(joinedRooms);
};

// *********** Fetch trakcs ************
export const fetchTracksController = async (request, response) => {
  const {roomId} = request.params;

  try {
    const room = await roomModel.findById(roomId);

    if(room.tracks) {
      var tracks = [];

      for(const t of room.tracks){
        tracks.push({ trackUrl : t.trackUrl, trackName: t.trackName})
      }
    }
    return response.send(tracks);
  } catch(error) {
    return response.status(500).send({message: "Internal srever error"});
  }
}

// *********** Music controller ***********
export const addMusicToRoomPlayerController = async (request, response) => {
  const roomId = request.body.roomId;

  const {trackName} = request.body;
  const {trackUrl} = request.body;
  const room = await roomModel.findById(roomId);
  room.tracks.push({trackName, trackUrl});

  room.save()
  return response.status(200).send({
    message: "Track has been added"
  })
};

export const fetchRoomMembers = async (request, response) => {
  const  roomId  = request.body.roomid;
  try {
    const room = await roomModel.findById(roomId); 
    const membersInfo = [];

    for (const member of room.members) {
      const user = await userModel.find({username: member.username})
      membersInfo.push({ username: user[0].username, profilePic: user[0].profilePic });
    }

    return response.send(membersInfo); // Corrected 'resopnse' to 'response'
  } catch (e) {
    response.send({ "Something went wrong": e });
  }
};
