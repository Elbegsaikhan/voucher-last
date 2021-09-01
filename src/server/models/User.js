var mongoose = require('mongoose');
let ObjectId = mongoose.Schema.ObjectId;
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var UserSchema = mongoose.Schema({
    email: String,
    first_name: String,
    last_name: String,
    password: String,
    more: String,
    company: String,
    profession: String,
    birthday: Number,

    bankName: String,
    account: String,
    accountName: String,

    name: String,
    slug: String,
    bio: String,
    logo: String,
    image: String,
    facebook: String,
    instagram: String,
    youtube: String,
    phone: Number,
    membership: {type: String, enum: ['platinum', 'gold'], default: 'gold'},
    category: [{type : ObjectId , ref : 'Category'}],
    location: {type : ObjectId , ref : 'Location'},



    created: {type: Date, default: Date.now},
    role: {type: String, enum: ['admin', 'company', 'user'], default: 'user'},
    status: {type: String, enum: ['active', 'pending', 'delete'], default: 'pending'},
});
UserSchema.plugin(deepPopulate, {
    whitelist: ['category', "location"],
    populate: {
        'category':{
            select:'_id slug title'
        },
        'location':{
            select:'_id slug title'
        },
    }
});
module.exports = mongoose.model('User', UserSchema);
