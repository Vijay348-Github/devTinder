const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 20,
        },
        lastName: {
            type: String,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error("Invalid email address :", value);
                }
            },
        },
        password: {
            type: String,
            validate(value) {
                if (!validator.isStrongPassword(value)) {
                    throw new Error("Enter a strong password: ", value);
                }
            },
        },
        age: {
            type: Number,
            min: 18,
            max: 60,
        },
        gender: {
            type: String,
            enum : {
                values: ["male","female", "others"],
                message: `{VALUE} is not a valid gender.`
            },
            lowercase: true,
            trim: true,
            // validate(value) {
            //     if (!["male", "female", "others"].includes(value)) {
            //         throw new Error("Gender is not valid");
            //     }
            // },
        },
        photo: {
            type: String,
            default: "https://geographyandyou.com/images/user-profile.png",
        },
        about: {
            type: String,
            default: "Default about user",
        },
        skills: {
            type: [String],
        },
    },
    { timestamps: true }
);

userSchema.methods.getJwt = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, "Vijay@Work123", {
        expiresIn: "8d",
    });
    return token;
};

userSchema.methods.isPasswordValid = async function (passwordEnteredByUser) {
    const user = this;
    const passwordHash = user.password;

    const checkValid = await bcrypt.compare(
        passwordEnteredByUser,
        passwordHash
    );

    return checkValid;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
