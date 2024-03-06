const express = require('express')
const { Authenticateuser } = require('../../middleware/middleware')
const { upload } = require('../../utility/uploadfile')
const { addSurpeti } = require('./surpeti.controller')
const router = express.Router()

router.post('/add', Authenticateuser, upload.array('files'), addSurpeti)
module.exports = router