const express = require('express')
const { Authenticateuser } = require('../../middleware/middleware')
const { upload } = require('../../utility/uploadfile')
const { addTanpura, getTanpura, deletedTanpura } = require('./tanpura.controller')

const router = express.Router()

router.post('/add', upload.fields([{ name: 'file1', maxCount: 10 }]), addTanpura)

router.get('/get', Authenticateuser, getTanpura)
router.delete('/del/:id', deletedTanpura)






module.exports = router