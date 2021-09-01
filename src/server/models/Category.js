import mongoose from "mongoose";
let ObjectId = mongoose.Schema.ObjectId;

let CategorySchema = mongoose.Schema({
    title: String,
    order: Number,
    image: String,
    status: {type: String, enum : ['active', 'delete'], default: 'active'},
    slug: {type: String, unique: true},
    created: {type: Date, default: new Date()},
    parent: {type : ObjectId , ref : 'Category'}
});
module.exports = mongoose.model('Category', CategorySchema);
