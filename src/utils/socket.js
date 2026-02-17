const socket = require("socket.io");
const crypto = require("crypto");
const Chat = require("../models/chat");
const Message = require("../models/message");
const connectionRequest = require("../models/connectionrequest");

const generateRoomId = (userId1, userId2) => {
    return crypto
        .createHash("sha256")
        .update([userId1.toString(), userId2.toString()].sort().join("-"))
        .digest("hex");
};

// Track online users: userId → Set of socketIds (handles multiple tabs)
const onlineUsers = new Map();

const startSocketServer = (server) => {

    const io = socket(server, {
        path: "/api/socket.io", // MUST MATCH FRONTEND
        cors: {
            origin: process.env.CLIENT_URL,
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);
        const userId = socket.handshake.query.userId;
        socket.userId = userId;

        // ADD user to onlineUsers map
        if (!onlineUsers.has(userId)) {
            onlineUsers.set(userId, new Set());
        }
        onlineUsers.get(userId).add(socket.id);

        // Broadcast to all that this user is online
        io.emit("userOnline", { userId });

        // --------------------------------
        // JOIN CHAT
        // --------------------------------
        socket.on("joinChat", ({ from, to }) => {
            const roomId = generateRoomId(from, to);
            socket.join(roomId);
            console.log("User", from, "joined room", roomId);

            // Tell the joining user whether the other person is online
            const isOnline =
                onlineUsers.has(to) && onlineUsers.get(to).size > 0;
            socket.emit("onlineStatus", { userId: to, isOnline });
        });

        // --------------------------------
        // LEAVE CHAT
        // --------------------------------
        socket.on("leaveChat", ({ from, to }) => {
            if (!from || !to) return;

            const roomId = generateRoomId(from, to);
            socket.leave(roomId);

            // Stop any active typing indicator when leaving
            socket.to(roomId).emit("stopTyping", { userId: from });

            console.log(`👤 ${from} left room ${roomId}`);
        });

        // --------------------------------
        // TYPING INDICATOR
        // --------------------------------
        socket.on("typing", ({ to }) => {
            const from = socket.userId;
            const roomId = generateRoomId(from, to);

            // Emit only to the other user in the room (not back to sender)
            socket.to(roomId).emit("typing", { userId: from });
        });

        socket.on("stopTyping", ({ to }) => {
            const from = socket.userId;
            const roomId = generateRoomId(from, to);

            // Emit only to the other user in the room
            socket.to(roomId).emit("stopTyping", { userId: from });
        });

        // --------------------------------
        // SEND MESSAGE
        // --------------------------------
        socket.on("sendMessage", async ({ to, content }) => {
            try {
                const from = socket.userId;
                const roomId = generateRoomId(from, to);

                if (from.toString() === to.toString()) {
                    throw new Error("You cannot message yourself.");
                }

                const isConnected = await connectionRequest.exists({
                    $or: [
                        { fromId: from, toId: to, status: "accepted" },
                        { fromId: to, toId: from, status: "accepted" },
                    ],
                });

                if (!isConnected) {
                    socket.emit("error", {
                        message: "You are not connected with this user",
                    });
                    return;
                }

                let chat = await Chat.findOne({
                    participants: { $all: [from, to] },
                });

                if (!chat) {
                    chat = await Chat.create({ participants: [from, to] });
                }

                const message = await Message.create({
                    chatId: chat._id,
                    sender: from,
                    text: content,
                });

                chat.lastMessage = message._id;
                await chat.save();

                // Auto stop typing when message is sent
                socket.to(roomId).emit("stopTyping", { userId: from });

                io.to(roomId).emit("receiveMessage", {
                    _id: message._id.toString(),
                    from: message.sender.toString(),
                    content: message.text,
                    timestamp: message.createdAt,
                });
            } catch (err) {
                console.error("Send message error:", err);
            }
        });

        // --------------------------------
        // DISCONNECT
        // --------------------------------
        socket.on("disconnect", () => {
            console.log("Socket disconnected:", socket.id);

            // Remove socketId from the user's set
            if (onlineUsers.has(userId)) {
                onlineUsers.get(userId).delete(socket.id);

                // If user has no more active sockets, they're fully offline
                if (onlineUsers.get(userId).size === 0) {
                    onlineUsers.delete(userId);
                    io.emit("userOffline", { userId });
                }
            }
        });
    });
};

module.exports = startSocketServer;
