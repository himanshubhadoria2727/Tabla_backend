const mongoose = require('mongoose');

const tanpuraSchema = new mongoose.Schema({
    pitch: {
        type: String,
        required: true
    },
    types: {
        type: String,
        required: true
    },
    file1: {
        type: String, // Assuming it's an array of file paths or data
        default: ""
    },
    file2: {
        type: String,
        default: ""
    },
    file3: {
        type: String,
        default: ""
    },
    file4: {
        type: String,
        default: ""
    },
    bpm: {
        type: String,
        required: true
    }
});

const Tanpura = mongoose.model('Tanpura', tanpuraSchema);

module.exports = Tanpura;
