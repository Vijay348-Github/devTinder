const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { validateUserData } = require("./ValidateUser");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const hashPassword = await bcrypt.hash(password, 10);
        const user = new User({
            firstName,
            lastName,
            email,
            password: hashPassword,
        });
        validateUserData(req);
        await user.save();
        res.status(200).send("Signup successfull.");
    } catch (error) {
        res.status(500).json({
            error: "Failed to create.",
            details: error.message,
        });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(500).send("Invalid credentials.");
        }
        const passwordCheck = await bcrypt.compare(password, user.password);
        if (passwordCheck) {
            const token = await jwt.sign({ _id: user._id }, "vijay@143");
            res.cookie("token", token);
            res.status(200).send("Login successfull.");
        } else {
            throw new Error("Invalid credentials.");
        }
    } catch (error) {
        res.status(500).json({
            error: "failed to login",
            details: error.message,
        });
    }
});

app.get("/profile", async (req, res) => {
    try {
        const cookie = req.cookies;
        const { token } = cookie;
        const verify = await jwt.verify(token, "vijay@143");
        const { _id } = verify;
        const user = await User.findById(_id);
        res.status(200).send(user);
    } catch (error) {
        res.status(401).json({ details: error.message });
    }
});
