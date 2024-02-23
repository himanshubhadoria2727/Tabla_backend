const express = require('express')
const { Authenticateuser } = require('../../middleware/middleware')
const { upload } = require('../../utility/uploadfile')
const { addTabla, getTabla, delTabla } = require('./tabla.controller')
const router = express.Router()

router.post('/add', upload.single('taalfile'), addTabla);
router.get('/get', Authenticateuser, getTabla)
router.delete('/del/:id', delTabla)



module.exports = router