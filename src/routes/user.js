const userRouter = require("express").Router();
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionrequest");
const USER_FIELDS = "firstName lastName photo age gender about";
const User = require("../models/user");

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user._id;
        const connectionRequests = await ConnectionRequest.find({
            toId: loggedInUser,
            status: "interested",
        }).populate("fromId", "firstName lastName photo age gender about");

        res.status(200).json({
            message: "Fetched received connection requests successfully",
            data: connectionRequests,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch received connection requests",
        });
    }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user._id;
        const connections = await ConnectionRequest.find({
            $or: [
                { toId: loggedInUser, status: "accepted" },
                { fromId: loggedInUser, status: "accepted" },
            ],
        })
            .populate("fromId", USER_FIELDS)
            .populate("toId", USER_FIELDS);

        const data = connections.map((row) => {
            if (row.fromId._id.toString() === loggedInUser.toString()) {
                return row.toId;
            }
            return row.fromId;
        });

        res.status(200).json({
            message: "Fetched connections successfully",
            data: data,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch connections",
        });
    }
});

userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;

        const loggedInUser = req.user;
        const connections = await ConnectionRequest.find({
            $or: [{ fromId: loggedInUser._id }, { toId: loggedInUser._id }],
        }).select("fromId toId");

        const hideUsersFromFeed = new Set();
        connections.forEach((connection) => {
            hideUsersFromFeed.add(connection.fromId.toString());
            hideUsersFromFeed.add(connection.toId.toString());
        });

        const users = await User.find({
            $and: [
                {
                    _id: { $nin: Array.from(hideUsersFromFeed) },
                },
                { _id: { $ne: loggedInUser._id } },
            ],
        })
            .select(USER_FIELDS)
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            message: "Fetched feed successfully",
            data: users,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch feed",
        });
    }
});

userRouter.get("/user/:id", userAuth, async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId).select("firstName lastName");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user); // return user directly
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch user details" });
    }
});


module.exports = userRouter;
