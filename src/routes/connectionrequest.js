const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionrequest");
const User = require("../models/user");

requestRouter.post(
    "/send/request/:status/:toId",
    userAuth,
    async (req, res) => {
        try {
            const fromId = req.user._id;
            const toId = req.params.toId;
            const status = req.params.status;

            const allowedStatus = ["ignored", "interested"];
            if (!allowedStatus.includes(status)) {
                return res
                    .status(400)
                    .json({ message: "Status is not valid." });
            }

            const toUserExist = await User.findById(toId);
            if (!toUserExist) {
                return res.status(404).json({
                    message:
                        "The user you are trying to connect with does not exist",
                });
            }

            const existingRequest = await ConnectionRequest.findOne({
                $or: [
                    { fromId, toId },
                    { fromId: toId, toId: fromId },
                ],
            });
            if (existingRequest) {
                return res.status(400).json({
                    message:
                        "A connection request already exixts between these users.",
                });
            }

            const data = new ConnectionRequest({
                fromId,
                toId,
                status,
            });
            await data.save();
            res.status(200).json({
                message: "Connection request sent successfully.",
                data,
            });
        } catch (error) {
            res.status(500).json({
                message: "Connection request failed",
                error: error.message,
            });
        }
    }
);

requestRouter.post(
    "/request/review/:status/:requestId",
    userAuth,
    async (req, res) => {
        try {
            const loggedInUser = req.user;
            const { status, requestId } = req.params;

            const allowedStatus = ["accepted", "rejected"];
            if (!allowedStatus.includes(status)) {
                return res.status(400).json({
                    message: "Status is not valid.",
                });
            }

            const connectionRequest = await ConnectionRequest.findOne({
                _id: requestId,
                toId: loggedInUser._id,
                status: "interested",
            });
            if (!connectionRequest) {
                return res.status(404).json({
                    message: "No pending connection request found.",
                });
            }

            connectionRequest.status = status;
            const data = await connectionRequest.save();
            res.status(200).json({
                message: "Connection request " + status,
                data,
            });
        } catch (error) {
            res.status(500).json({
                message: "Failed to review connection request",
            });
        }
    }
);

module.exports = requestRouter;
