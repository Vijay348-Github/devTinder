const socket = require("socket.io");

const startSocketServer = (server) => {
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173",
        },
    });
    io.on("connection", (socket) => {
        socket.on("joinChat", ({ userId, messagetoid }) => {
            const createRoomId = [userId, messagetoid].sort().join("-");
            socket.join(createRoomId);
            console.log(createRoomId);
        });
        socket.on("sendMessage", ({ from, to, content, timestamp }) => {
            const roomId = [from, to].sort().join("-");
            io.to(roomId).emit("receiveMessage", { from, content, timestamp });
        });

        socket.on("disconnect", () => {});
    });
};
module.exports = startSocketServer;
