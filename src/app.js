const express = require("express");
const { adminAuth } = require("./middleware/auth");
const connectDb = require("./config/database");
const app = express();
const User = require("./models/user");

app.post("/signup", async (req, res) => {
    const user = new User({
        firstName: "Vijay",
        lastName: "Kishtammgari",
        email: "abc123@me.com",
        age: 24,
        gender: "male",
    });

    try {
        await user.save();
        res.send("User added successfully.");
    } catch (error) {
        console.log("User not added successfully: ", error.message);
    }
});

connectDb()
    .then(() => {
        console.log("Database connection established succesfully.");
        app.listen(3000, () => {
            console.log("Server running on port 3000");
        });
    })
    .catch((err) => {
        console.log("Database connection not established succesfully");
    });
