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

    if(!user.email){
        return res.status(400).json({error : "Missing required fields: email."})
    }

    try {
        await user.save();
        res.send("User added successfully.");
    } catch (error) {
        console.log("User not added successfully: ", error.message);
        res.status(500).json({ error : "Failed to create user", details: error.message});
    }
});

app.get("/user", async (req, res) => {
    const userEmail = req.body.email;

    if(!userEmail){
        return res.status(500).json({ error : "Missing email parameter."})
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

    if(!emailId){
        return res.status(400).json({error:"Missing email parameter"});
    }

    try{
        const user = await User.findOne({email : emailId});
        res.send(user);
    }catch(err){
        res.status(400).send("Something went wrong.........")
    }
})

app.get("/users", async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (err) {
        res.status(400).send("something went wrong............");
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
