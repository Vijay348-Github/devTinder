const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middleware/auth");


requestRouter.post("/sendConnectionRequest", userAuth, (req, res) => {
    const user = req.user;
    console.log("Connection request sent.");
    res.status(200).send(`${user.firstName} sent connection request.`);
});

module.exports = requestRouter;