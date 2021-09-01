import mongoose from "mongoose";
let ObjectId = mongoose.Schema.ObjectId;
var deepPopulate = require("mongoose-deep-populate")(mongoose);

let RequestSchema = mongoose.Schema({
    amount: Number,
    sku: String,
    tution: { type: ObjectId, ref: "Tution" },
    user: { type: ObjectId, ref: "User" },
    status: {
        type: String,
        enum: ["active", "pending", "delete"],
        default: "pending",
    },
    created: { type: Date, default: new Date() },
});
RequestSchema.plugin(deepPopulate, {
    whitelist: ["tution", "user"],
    populate: {
        tution: {
            select: "_id price title",
        },
        user: {
            select: "_id phone email first_name last_name company profession birthday more",
        },
    },
});
module.exports = mongoose.model("Request", RequestSchema);
