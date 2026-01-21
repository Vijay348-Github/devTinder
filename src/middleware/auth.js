const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).send("Please Login to access this resource.");
        }
        const decodedUser = await jwt.verify(token, "Vijay@Work123");
        const { _id } = decodedUser;
        const user = await User.findById(_id);
        if (!user) {
            throw new Error("User not found");
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(400).json({details: error.message});
    }
};
module.exports = {
    userAuth,
};
