const mongoose = require('mongoose')

const surpertiSchema = mongoose.Schema({
    files: {
        type: [String]
    }
})
const Surpeti = mongoose.model('Surpeti', surpertiSchema)
module.exports = Surpeti