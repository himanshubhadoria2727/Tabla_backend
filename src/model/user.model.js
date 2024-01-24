const mongoose = require('mongoose');


const userschema = new mongoose.Schema({
    phone_no: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
    firstname: {
        type: String,
        trim: true,
    },
    lastname: {
        type: String,
        trim: true,
    },
    password: {
        type: String,
    },
    country_code: {
        type: String,
        required: true,
    },
    country_name: {
        type: String,
        required: true,
    },
    otp: {
        type: String
    },
    otp_expire: {
        type: Date
    },
    verified: {
        type: Boolean
    },
    plan: {
        type: String,
    },

}, {
    timestamps: true,
});







const User = mongoose.model('User', userschema);


module.exports = User
