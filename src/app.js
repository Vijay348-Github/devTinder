require("dotenv").config();
const express = require("express");
const connectDb = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    }),
);
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/connectionrequest");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chatroute");
const startSocketServer = require("./utils/socket");
const emailRoute = require("./routes/emailroute");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);
app.use("/", emailRoute);

const server = http.createServer(app);
startSocketServer(server);

connectDb()
    .then(() => {
        console.log("Database connection established succesfully.");
        server.listen(process.env.PORT, () => {
            console.log("Server running on port 3000");
        });
    })
    .catch((err) => {
        console.log("Database connection not established succesfully");
    });
