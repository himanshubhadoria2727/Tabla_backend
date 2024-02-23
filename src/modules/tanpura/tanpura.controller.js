const Tanpura = require("../../model/tanpura.model");



const addTanpura = async (req, res) => {
    try {

        const { pitch, types, bpm } = req.body;

        console.log(req.files, 'jsssssssssssssssss');

        // const files = {
        //     file1: req.files['file1'][0].buffer.toString('base64'),
        //     file2: req.files['file2'][0].buffer.toString('base64'),
        //     file3: req.files['file3'][0].buffer.toString('base64'),
        //     file4: req.files['file4'][0].buffer.toString('base64'),
        // };

        // // Now you can create a Tanpura with the received data
        const tanpura = new Tanpura({
            pitch,
            types,
            file1: req.files['file1'][0]?.filename ? req.files['file1'][0]?.filename : null,
            file2: req.files['file1'][1]?.filename ? req.files['file1'][1]?.filename : null,
            file3: req.files['file1'][2]?.filename ? req.files['file1'][2]?.filename : null,
            file4: req.files['file1'][3]?.filename ? req.files['file1'][3]?.filename : null,
            bpm,
        });

        // Save the Tanpura to the database
        const savedTanpura = await tanpura.save();

        res.status(200).json({
            "message": "tanpura will be added sucessfully"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


const getTanpura = async (req, res) => {
    try {
        const tanpura = await Tanpura.find({});
        if (!tanpura) {
            return res.status(404).json({ message: 'Tanpura not found' });
        }
        res.json(tanpura);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}



const deletedTanpura = async (req, res) => {
    try {
        const deletedTanpura = await Tanpura.findByIdAndDelete(req.params.id);
        if (!deletedTanpura) {
            return res.status(404).json({ message: 'Tanpura not found' });
        }
        res.json({ message: 'Tanpura deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    addTanpura, deletedTanpura, getTanpura
}