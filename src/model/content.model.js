const mongoose = require('mongoose')

const contentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    bannerImage: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    }
)

const Content = mongoose.model('Content', contentSchema)

module.exports = Content

