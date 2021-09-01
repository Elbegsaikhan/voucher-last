import mongoose from "mongoose";
let ObjectId = mongoose.Schema.ObjectId;
var deepPopulate = require('mongoose-deep-populate')(mongoose);

let NewsSchema = mongoose.Schema({
    company: {type : ObjectId , ref : 'User'},
    title: String,
    body: String,
    created: {type: Date, default: new Date()},
    status: {type: String, enum : ['active', 'delete'], default: 'active'},
    image: String,
    slug: {type: String, unique: true},
});
NewsSchema.plugin(deepPopulate, {
    whitelist: ['company'],
    populate: {
        'group':{
            select:'_id title order'
        },
    }
});
module.exports = mongoose.model('News', NewsSchema);
