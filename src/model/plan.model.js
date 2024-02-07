const mongoose = require('mongoose');

const planschema = new mongoose.Schema({
    planname: {
        type: String,

    },

    description: {
        type: String,
        required: true
    },
    plantype: {
        type: [{
            country: {
                type: String
            },
            amount: {
                type: Number
            }
        }]
    },
    makeAt: {
        type: Date,
        default: Date.now().t
    }



}, {
    timestamps: true,
});


const Plan = mongoose.model('Plan', planschema);

module.exports = Plan;
