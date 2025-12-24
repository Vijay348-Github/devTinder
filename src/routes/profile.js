const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const { validateProfileDataToBeEdited } = require("../utils/ValidateUser");
const bcrypt = require("bcrypt");
const validator = require("validator");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
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

profileRouter.post("/profile/edit", userAuth, async (req, res) => {
    try {
        const checkIfEditIsAlllowedForTheField = validateProfileDataToBeEdited(
            req.body
        );
        if (!checkIfEditIsAlllowedForTheField) {
            return res.status(400).send("Field not allowed not edit.");
        }
        const loggedInUser = req.user;
        Object.keys(req.body).forEach((field) => {
            loggedInUser[field] = req.body[field];
        });

        await loggedInUser.save();
        return res.status(200).json({
            message: ` ${loggedInUser.firstName}, your profile is updated successfully.`,
            user: loggedInUser,
        });
    } catch (err) {
        return res.status(500).send("Profile data not updated successfully.");
    }
});

profileRouter.post("/profile/passwordchange", userAuth, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res
                .status(400)
                .send("Old password and new password are required.");
        }

        const userLoggedIn = req.user;
        const compareOldAndLoggedInPassword = await bcrypt.compare(
            oldPassword,
            userLoggedIn.password
        );

        if (!compareOldAndLoggedInPassword) {
            return res.status(400).send("Old password is incorrect.");
        }

        if (!validator.isStrongPassword(newPassword)) {
            return res
                .status(400)
                .send(
                    "New Passwrod is not strong enough, so please enter a new one"
                );
        }

        userLoggedIn.password = await bcrypt.hash(newPassword, 10);
        await userLoggedIn.save();
        return res.status(200).send("Password changed successfully.");
    } catch (error) {
        res.status(500).send("Password not changed successfully.");
    }
});

module.exports = profileRouter;
