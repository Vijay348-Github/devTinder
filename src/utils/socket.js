const socket = require("socket.io");
const crypto = require("crypto");
const Chat = require("../models/chat");
const Message = require("../models/message");

const generateRoomId = (userId1, userId2) => {
    return crypto
        .createHash("sha256")
        .update([userId1, userId2].sort().join("-"))
        .digest("hex");
};

const startSocketServer = (server) => {
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173",
        },
    });
    io.on("connection", (socket) => {
        socket.on("joinChat", ({ userId, messagetoid }) => {
            const createRoomId = generateRoomId(userId, messagetoid);
            socket.join(createRoomId);
            console.log(createRoomId);
        });
        socket.on("sendMessage", async ({ from, to, content, timestamp }) => {
            try {
                const roomId = generateRoomId(from, to);

                // Find or create chat
                let chat = await Chat.findOne({
                    participants: { $all: [from, to] },
                });

                if (!chat) {
                    chat = await Chat.create({
                        participants: [from, to],
                    });
                }

                // Create message
                const message = await Message.create({
                    chatId: chat._id,
                    sender: from,
                    text: content,
                });

                // Update lastMessage
                chat.lastMessage = message._id;
                await chat.save();

                // Emit to both users
                io.to(roomId).emit("receiveMessage", {
                    _id: message._id,
                    from: message.sender,
                    content: message.text,
                    timestamp: message.createdAt,
                });
            } catch (err) {
                console.error("Send message error:", err);
            }
        });

        socket.on("disconnect", () => {});
    });
};
module.exports = startSocketServer;
