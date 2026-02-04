const express = require("express");
const chatRouter = express.Router();
const Chat = require("../models/chat");
const { userAuth } = require("../middleware/auth");
const Message = require("../models/message");
const connectionRequest = require("../models/connectionrequest"); // ← ADD THIS

chatRouter.get("/chat/:receiverId", userAuth, async (req, res) => {
    try {
        const myId = req.user._id;
        const receiverId = req.params.receiverId;

        // ✅ CHECK CONNECTION FIRST
        const isConnected = await connectionRequest.exists({
            $or: [
                { fromId: myId, toId: receiverId, status: "accepted" },
                { fromId: receiverId, toId: myId, status: "accepted" },
            ],
        });

        if (!isConnected) {
            return res
                .status(403)
                .json({ message: "You are not connected with this user" });
        }

        const chat = await Chat.findOne({
            participants: { $all: [myId, receiverId] },
        });

        if (!chat) {
            return res.status(200).json({ messages: [] });
        }

        const messages = await Message.find({ chatId: chat._id })
            .sort({ createdAt: 1 })
            .populate("sender", "firstName lastName");

        return res.status(200).json({ messages });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to fetch chat" });
    }
});

module.exports = chatRouter;
