import mongoose from 'mongoose'
let ObjectId = mongoose.Schema.ObjectId

let CuponcodeSchema = mongoose.Schema({
    code: Number,
    user: {type : ObjectId , ref : 'User'},
    status: {type: String, enum: ['active', 'delete'], default: 'active'},
    created: {type: Date, default: new Date()}
})

module.exports = mongoose.model('Cuponcode', CuponcodeSchema)
