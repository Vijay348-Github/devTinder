const express = require("express");
const { adminAuth } = require("./middleware/auth");
const connectDb = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
    // console.log(req.body);

    // Hard coded values

    // const user = new User({
    //     firstName: "Virat",
    //     lastName: "Kohli",
    //     email: "virat@18.com",
    //     age: 38,
    //     gender: "male",
    // });

    // Dynamic data

    const user = new User(req.body);

    if (!user.email) {
        return res
            .status(400)
            .json({ error: "Missing required fields: email." });
    }

    try {
        await user.save();
        res.send("User added successfully.");
    } catch (error) {
        console.log("User not added successfully: ", error.message);
        res.status(500).json({
            error: "Failed to create user",
            details: error.message,
        });
    }
});

app.get("/user", async (req, res) => {
    const userEmail = req.body.email;

    if (!userEmail) {
        return res.status(500).json({ error: "Missing email parameter." });
    }

    try {
        const user = await User.find({ email: userEmail });
        res.send(user);
    } catch (err) {
        res.status(400).send("Something went wrong.........");
    }
});

app.get("/user1", async (req, res) => {
    const emailId = req.body.email;

    if (!emailId) {
        return res.status(400).json({ error: "Missing email parameter" });
    }

    try {
        const user = await User.findOne({ email: emailId });
        res.send(user);
    } catch (err) {
        res.status(400).send("Something went wrong.........");
    }
});

app.get("/users", async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (err) {
        res.status(400).send("something went wrong............");
    }
});

app.get("/iduser", async (req, res) => {
    const userId = req.body.id;

    try {
        const user = await User.findById(userId);
        res.send(user);
    } catch (error) {
        res.status(500).json({
            error: "User not found with the given ID",
            details: error.message,
        });
    }
});

app.delete("/user", async (req, res) => {
    const id = req.body.id;

    try {
        const delUser = await User.findByIdAndDelete(id);

        if (!delUser) {
            res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({
            message: "User deleted succesfully.",
            user: delUser,
        });
    } catch (error) {
        res.status(500).json({
            error: "User not deleted.",
            details: error.message,
        });
    }
});

// app.patch("/user", async (req, res) => {
//     const user = req.body;
//     const userIdd = req.body.id;

//     try{
//         await User.findByIdAndUpdate({_id: id}, user);
//         res.send("User updated suceessfully.")
//     }catch(error){
//         res.status(400).send("Something went wrong.........")
//     }
// })

app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const newUser = req.body;

    try {
        const ALLOWED_UPDATES = ["photo", "about", "gender", "skills"];
        const isUpdateAllowed = Object.keys(newUser).every((k) =>
            ALLOWED_UPDATES.includes(k)
        );
        if (!isUpdateAllowed) {
            throw new Error("Update not allowed");
        }
        if(newUser?.skills.length > 10){
            throw new Error("Skills cannot be more than 10.")
        }
        await User.findByIdAndUpdate({ _id: userId }, newUser);
        res.send("User updated successfully.");
    } catch (error) {
        res.status(400).json({ details: error.message });
    }
});

app.delete("/usermany", async (req, res) => {
    const last = req.body.lastName;
    try {
        await User.deleteMany({ lastName: last });
        res.status(200).json({ result: "Users deleted successfully." });
    } catch (error) {
        res.status(500).json({ details: error.message });
    }
});

app.patch("/useremail", async (req, res) => {
    const emailAdd = req.body.email;
    const newUser = req.body;

    try {
        await User.updateOne({ email: emailAdd }, newUser);
        res.status(200).send("One updated successfully.");
    } catch (error) {
        res.status(500).json({ details: error.message });
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
