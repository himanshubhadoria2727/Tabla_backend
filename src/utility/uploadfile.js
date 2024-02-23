const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'media');
    },
    filename: function (req, file, cb) {
        console.log(file, req.body);

        cb(null, Date.now() + '-' + file.originalname);
    },

});

const upload = multer({ storage: storage });

module.exports = {
    upload
}
