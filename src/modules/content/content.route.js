const express = require('express')
const { addContent, editcontent, deletedcontent, allContent, singleeditcontent } = require('./content.controller')

const router = express.Router()



router.post('/addContent', addContent)
router.get('/allContent', allContent)
router.get('/editContent/:id', singleeditcontent)

router.put('/editContent/:id', editcontent)
router.delete('/:id', deletedcontent)


module.exports = router






