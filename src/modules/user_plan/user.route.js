const express = require('express')
const { Authenticateuser } = require('../../middleware/middleware')
const { createUserplan, getUserplan, deletedUser } = require('./userplan.controller')


const router = express.Router()

router.post('/userplan', Authenticateuser, createUserplan)

router.get('/userplan', getUserplan)
router.delete('/userplan/:id', deletedUser)




module.exports = router