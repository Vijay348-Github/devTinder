const mongoose = require("mongoose");
const validator = require("validator");

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
            validate(value){
                if(!validator.isEmail(value)){
                    throw new Error("Invalid email address :",value);
                }
            }
        },
        password: {
            type: String,
            validate(value){
                if(!validator.isStrongPassword(value)){
                    throw new Error("Enter a strong password: ", value)
                }
            }
        },
        age: {
            type: Number,
            min: 18,
            max: 60,
        },
        gender: {
            type: String,
            validate(value) {
                if (!["male", "female", "others"].includes(value)) {
                    throw new Error("Gender is not valid");
                }
            },
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

const User = mongoose.model("User", userSchema);

module.exports = User;
