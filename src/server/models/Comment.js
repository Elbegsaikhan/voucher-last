import mongoose from "mongoose";
let ObjectId = mongoose.Schema.ObjectId;
var deepPopulate = require('mongoose-deep-populate')(mongoose);

let CommentSchema = mongoose.Schema({
    tution: {type : ObjectId , ref : 'Tution'},
    comment: String,
    user: {type : ObjectId , ref : 'User'},
    status: {type: String, enum : ['active', 'delete'], default: 'active'},
    created: {type: Date, default: new Date()},
});
CommentSchema.plugin(deepPopulate, {
    whitelist: ['user'],
    populate: {
        'user':{
            select:'_id first_name last_name email'
        },
    }
});
module.exports = mongoose.model('Comment', CommentSchema);
