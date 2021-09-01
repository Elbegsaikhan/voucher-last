import mongoose from "mongoose";
let ObjectId = mongoose.Schema.ObjectId;

let LocationSchema = mongoose.Schema({
    title: String,
    order: Number,
    status: {type: String, enum : ['active', 'delete'], default: 'active'},
    slug: {type: String, unique: true},
    created: {type: Date, default: new Date()},
    parent: {type : ObjectId , ref : 'Location'}
});
module.exports = mongoose.model('Location', LocationSchema);
