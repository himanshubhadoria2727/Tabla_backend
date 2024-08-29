const express = require('express')
const { Authenticateuser } = require('../../middleware/middleware')
const { upload } = require('../../utility/uploadfile')
const { addCategory, getAllCategory } = require('./category.controller')
const router = express.Router()

router.post('/addCategory', upload.single('image'), addCategory)
/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     responses:
 *       200:
 *         description: A list of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
router.get('/getCategory', getAllCategory)




module.exports = router