import mongoose from 'mongoose'

let ObjectId = mongoose.Schema.ObjectId;
var deepPopulate = require("mongoose-deep-populate")(mongoose);


let WithdrawSchema = mongoose.Schema({
    amount: Number,
    sku: String,
    product: {type: ObjectId, ref: 'Product'},
    user: {type: ObjectId, ref: 'User'},
    companyID: String,
    status: {type: String, enum: ["active", "pending", "delete"], default: 'pending'},
    delivery: {type: String, enum: ['hvrgej', 'hvrgsen', 'hvleegdej'], default: 'hvleegdej'},
    created: {type: Date, default: new Date()},

})
WithdrawSchema.plugin(deepPopulate, {
    whitelist: ["product", "user"],
    populate: {
        product: {
            select: "_id minprice title",
        },
        user: {
            select: "_id phone email first_name last_name company profession birthday more",
        },
    },
});
module.exports = mongoose.model("Withdraw", WithdrawSchema);

