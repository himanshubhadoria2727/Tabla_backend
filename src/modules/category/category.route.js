const express = require('express')
const { Authenticateuser } = require('../../middleware/middleware')
const { upload } = require('../../utility/uploadfile')
const { addCategory, getAllCategory } = require('./category.controller')
const router = express.Router()

router.post('/addCategory', Authenticateuser, upload.single('category'), addCategory)
router.get('/getCategory', Authenticateuser, getAllCategory)




module.exports = router