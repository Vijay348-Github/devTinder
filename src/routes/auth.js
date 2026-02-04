const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validateUserData } = require("../utils/ValidateUser");

authRouter.post("/signup", async (req, res) => {
    try {
        validateUserData(req);
        const { firstName, lastName, email, password, age, gender, about } =
            req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            age,
            gender,
            about,
        });
        const savedUSer = await user.save();
        const token = await savedUSer.getJwt();
        res.cookie("token", token, {
            expires: new Date(Date.now() + 8 * 36000000),
        });
        res.status(201).send(savedUSer);
    } catch (error) {
        res.status(500).json({
            error: "Failed to create user",
            details: error.message,
        });
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).send("INVALID CREDENTIALS");
        }
        const hashPassword = await user.isPasswordValid(password);

        if (hashPassword) {
            const token = await user.getJwt();
            res.cookie("token", token, {
                expires: new Date(Date.now() + 8 * 36000000),
            });
            res.status(200).send(user);
        } else {
            throw new Error("INVALID CREDENTIALS");
        }
    } catch (error) {
        res.status(400).json({
            error: "Failed to login",
            details: error.message,
        });
    }
});

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    });

    res.status(200).send("Logout successful.");
});

module.exports = authRouter;
