const express = require('express')
const { Authenticateuser } = require('../../middleware/middleware')
const { createUserplan, getUserplan } = require('./userplan.controller')


const router = express.Router()

router.post('/userplan', Authenticateuser, createUserplan)

router.get('/userplan', getUserplan)




module.exports = router