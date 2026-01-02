const mongoose = require("mongoose");

const connectionRequestModel = new mongoose.Schema(
    {
        fromId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        toId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        status: {
            type: String,
            enum: {
                values: ["interested", "accepted", "ignored", "rejected"],
                message: `{VALUE} is not supported.`,
            },
        },
    },
    { timestamps: true }
);

connectionRequestModel.pre("save", function(next){
    const connectionRequest = this;
    if(connectionRequest.fromId.equals(connectionRequest.toId)){
        throw new Error("You cannot send a connection request to yourself.");
    }
    next();
}) 


const ConnectionRequest = mongoose.model(
    "ConnectionRequest",
    connectionRequestModel
);
module.exports = ConnectionRequest;
