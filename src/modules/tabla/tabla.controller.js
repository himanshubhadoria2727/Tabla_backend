const Tabla = require("../../model/tabla.model");




const addTabla = async (req, res) => {
    try {
        const { pitch, taalname, subtaalname, taal, bpm } = req.body;
        console.log(req.files);
        const taalFiles = req.files.map((file, index) => ({
            filename: file.filename,
            bpm: bpm[index],
        }));

        const newTabla = new Tabla({
            pitch,
            taalname,
            subtaalname,
            taal,
            taalfiles,
        });

        await newTabla.save();
        console.log(taalFiles, "hfuef");

        return res.status(200).json({ message: 'Tabla added successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}



module.exports = {
    addTabla
}