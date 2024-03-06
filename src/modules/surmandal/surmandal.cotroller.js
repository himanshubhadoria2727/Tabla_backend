const Surmandal = require("../../model/surmandal.model");




const addsurmandal = async (req, res) => {
    try {
        const { pitch, raag } = req.body;
        const files = req.files.map(file => file.path);

        const newSurmandal = new Surmandal({
            pitch,
            raag,
            files,
        });

        const savedSurmandal = await newSurmandal.save();

        res.status(201).json(savedSurmandal);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

const deletdsurmandal = async (req, res) => {
    try {
        const deletedSurmandal = await Surmandal.findByIdAndDelete(req.params.id);
        if (!deletedSurmandal) {
            return res.status(404).json({ message: 'Surmandal not found' });
        }
        res.json({ message: 'Surmandal deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

const getsurmandal = async (req, res) => {
    try {
        const allSurmandals = await Surmandal.find();
        res.json(allSurmandals);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}
module.exports = {
    addsurmandal, getsurmandal, deletdsurmandal
}