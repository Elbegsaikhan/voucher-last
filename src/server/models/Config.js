import mongoose from "mongoose";

let ConfigSchema = mongoose.Schema({
    title: String,
    description: String,
    logo: String,
    logo1: String,
    background: String,
    homeImage: String,
    homeBanner1: String,
    homeBanner2: String,
    phone: String,
    email: String,
    address: String,
    footerText: String,
    facebook: String,
    instagram: String,
    youtube: String,
    dans: String,
    dansNer: String,
    amount: String,
    status: {type:String, enum: ['active', 'delete'], default: "active"}
});
module.exports = mongoose.model('Config', ConfigSchema);