const mongoose = require('mongoose')

const surmandalSchema = mongoose.Schema({
    pitch: {
        type: String
    },
    raag: {
        type: String
    },
    files: {
        type: [String]
    }
})

const Surmandal = mongoose.model('Surmandal', surmandalSchema)
module.exports = Surmandal