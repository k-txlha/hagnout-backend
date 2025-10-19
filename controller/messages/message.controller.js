import roomModel from "../../models/rooms/roomModel.js";
import userModel from "../../models/users/userModel.js";
import redisClient from "../../redis/redis.js";

export const getMessages = async (req, res) => {
	const id = req.params.id;

	const cachedConversations = await redisClient.get(id);

	if(cachedConversations) {
		const conversationsArray = JSON.parse(cachedConversations)
		return res.json(conversationsArray);
	}

	try {
		const room = await roomModel.findById(id);
			if (!room) {
			return res.status(404).send({ message: "Room not found" });
		}
		
		if (room.conversations) {
			var conversations = [];

			for (const c of room.conversations) {
				const user = await userModel.findById(c.senderId.toString());
				if (user) {
					conversations.push({
						messageContent: c.messageContent,
						fileUrl: c.fileUrl,
						timestamp: c.createdAt,
						username: user.username,
						profilePic: user.profilePic
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

export const sendMessage = async (req, res) => {
	const messageContent = req.body.messageContent;
	const { senderId } = req.body;
	const { roomId } = req.body;
	const { fileUrl } = req.body;

	try {
		const room = await roomModel.findById(roomId);
		const user = await userModel.findById(senderId);

		if (!room) {
			return res.status(404).send({ message: "Room not found" });
		}

		// Redis for caching
		const cachedMessages = await redisClient.get(roomId);

		if (cachedMessages) {
			const messageArray= JSON.parse(cachedMessages)
			const newMessage = {messageContent, fileUrl, timestamp : Date.now(), username : user.username, profilePic: user.profilePic}
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
