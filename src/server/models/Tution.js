import mongoose from "mongoose";
let ObjectId = mongoose.Schema.ObjectId;
var deepPopulate = require('mongoose-deep-populate')(mongoose);

let TutionSchema = mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    sale: Number,
    saleDate: {type: Date},
    color: String,
    images: [String],
    company: {type : ObjectId , ref : 'User'},
    group: {type : ObjectId , ref : 'Group'},
    status: {type: String, enum : ['active', 'pending', 'delete'], default: 'active'},
    created: {type: Date, default: new Date()},
});
TutionSchema.plugin(deepPopulate, {
    whitelist: ['company', 'group', 'group.title'],
    populate: {
        'group':{
            select:'_id title order'
        },
        'group.title':{
            select:'_id title status'
        },
    }
});
module.exports = mongoose.model('Tution', TutionSchema);
