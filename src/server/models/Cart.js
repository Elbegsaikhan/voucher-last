import mongoose from 'mongoose'
let ObjectId = mongoose.Schema.ObjectId

let cartSchema = mongoose.Schema({
    user: {type : ObjectId , ref : 'User'},
    product: {type : ObjectId , ref : 'Product'},
    type: Number,
    status: {type:String, enum: ['active', 'delete'], default: 'active'},
    payment: {type:String, enum: ['no', 'yes'], default: 'no'},
    created: {type: Date, default: new Date()},
});

module.exports = mongoose.model('Cart', cartSchema)
