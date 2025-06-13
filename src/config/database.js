const mongoose = require("mongoose");

const connectDb = async () => {
    await mongoose.connect(
        "mongodb+srv://nodejsproject:ruY9ZEOtKFpmToG3@workingwithnode.h8redrm.mongodb.net/devTinder"
    );
};

module.exports = connectDb;
