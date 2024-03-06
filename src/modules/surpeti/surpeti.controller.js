const Surpeti = require("../../model/surpeti.model");

const addSurpeti = async (req, res) => {
    try {
        const files = req.files.map(file => file.path);

        const newSurpeti = new Surpeti({
            files,
        });

        const savedSurpeti = await newSurpeti.save();

        res.status(201).json(savedSurpeti);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {
    addSurpeti
}