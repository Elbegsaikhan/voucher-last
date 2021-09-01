import mongoose from "mongoose";

let SliderSchema = mongoose.Schema({
    title: String,
    description: String,
    link: String,
    order: Number,
    position: Number,
    image: String,
    status: {type:String, enum: ['active', 'delete'], default: "active"},
    created: {type: Date, default: new Date()},
});
module.exports = mongoose.model('Slider', SliderSchema);