import mongoose from "mongoose";
let ObjectId = mongoose.Schema.ObjectId;
var deepPopulate = require('mongoose-deep-populate')(mongoose);

let GroupSchema = mongoose.Schema({
    title: {type : ObjectId , ref : 'GroupName'},
    company: {type : ObjectId , ref : 'User'},
    order: Number,
    status: {type: String, enum : ['active', 'delete'], default: 'active'},
});
GroupSchema.plugin(deepPopulate, {
    whitelist: ['title'],
    populate: {
        'title':{
            select:'_id title status'
        },
    }
});
module.exports = mongoose.model('Group', GroupSchema);
