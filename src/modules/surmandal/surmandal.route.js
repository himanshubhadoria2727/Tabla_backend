const express = require('express')
const { Authenticateuser } = require('../../middleware/middleware')
const { upload } = require('../../utility/uploadfile')
const { addsurmandal, getsurmandal, deletdsurmandal } = require('./surmandal.cotroller')
const router = express.Router()

router.post('/add', Authenticateuser, upload.array('files'), addsurmandal)
router.get('/get', Authenticateuser, getsurmandal)
router.delete('/del/:id', deletdsurmandal)
module.exports = router