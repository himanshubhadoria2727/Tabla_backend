const mongoose = require('mongoose');

const tablaSchema = mongoose.Schema({
    pitch: {
        type: String,
        required: true
    },
    taalname: {
        type: mongoose.Schema.ObjectId,
        ref: "Category",
        required: true
    },
    subtaalname: {
        type: mongoose.Schema.ObjectId,
        ref: "Subcategory",
        required: true
    },
    taal: [
        {
            name: {
                type: String,
                required: true
            }
        }
    ],
    taalfiles: [
        {
            filename: String,
            bpm: String
        }
    ]

}, {
    timestamps: true
});

const Tabla = mongoose.model('Tabla', tablaSchema);

module.exports = Tabla;
