import mongoose from "mongoose";
let ObjectId = mongoose.Schema.ObjectId;
var deepPopulate = require('mongoose-deep-populate')(mongoose);

let GroupNameSchema = mongoose.Schema({
    title: String,
    status: {type: String, enum : ['active', 'delete'], default: 'active'},
});
module.exports = mongoose.model('GroupName', GroupNameSchema);
