import mongoose from "mongoose";

let PageSchema = mongoose.Schema({
    title: String,
    body: String,
    created: {type: Date, default: new Date()},
    status: {type: String, enum : ['active', 'delete'], default: 'active'},
    image: String,
    slug: {type: String, unique: true},
});
module.exports = mongoose.model('Page', PageSchema);
