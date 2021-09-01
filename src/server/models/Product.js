import mongoose from 'mongoose'
let ObjectId = mongoose.Schema.ObjectId;
// var deepPopulate = require('mongoose-deep-populate')(mongoose);

let productSchema = mongoose.Schema( {
    title: String,
    image: String,
    desc: String,
    price: [Number],
    address: String,
    phone: Number,
    status: {type:String, enum: ['active', 'delete'], default: 'active'},
    date: {type: Date, default: new Date()},
    company: {type : ObjectId , ref : 'User'},
    torol: {type: String, enum: ['sale', 'trend', 'null'], default: 'null'},
    category: {type : ObjectId , ref : 'Category'},
    companyId: String,
    companyName: String,
    created: { type: Date, default: new Date() },
});
module.exports = mongoose.model('Product', productSchema)
