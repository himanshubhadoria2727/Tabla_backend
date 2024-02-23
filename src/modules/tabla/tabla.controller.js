const Tabla = require("../../model/tabla.model");





const addTabla = async (req, res) => {
    try {
        const { pitch, taalname, subtaalname, taal, bpm } = req.body;
        console.log(req.file);
        const taalfiles = bpm.map((s) => ({
            filename: req.file.filename,
            bpm: s,
        }));
        console.log(taalfiles);
        const newTabla = new Tabla({
            pitch,
            taalname,
            subtaalname,
            taal,
            taalfiles,
        });

        await newTabla.save();

        console.log(newTabla);
        return res.status(200).json({ message: 'Tabla added successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

const getTabla = async (req, res) => {
    try {
        let alltabla = await Tabla.find({}).populate('taalname').populate('subtaalname')


        return res.status(200).json({ alltabla })

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

const delTabla = async (req, res) => {
    try {
        const { id } = req.params
        let delT = await Tabla.findByIdAndDelete(id)
        return res.status(200).json({
            "message": "table will be deleted sucessfully"
        })

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }

}


module.exports = {
    addTabla, getTabla, delTabla
}