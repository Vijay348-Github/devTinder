const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth");

profileRouter.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            throw new Error("User doesn't exist.");
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(401).json({ details: error.message });
    }
});

module.exports = profileRouter;