const express = require('express')
const { Authenticateuser } = require('../../middleware/middleware')
const { upload } = require('../../utility/uploadfile')
const { addTabla } = require('./tabla.controller')
const router = express.Router()

router.post('/add', upload.any('taalfiles', 100),);



module.exports = router