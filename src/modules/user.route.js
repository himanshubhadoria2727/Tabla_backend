const express = require('express')
const { Authenticateuser } = require('../middleware/middleware')
const { addUser, verifyUser } = require('./user.controller')

const router = express.Router()


router.post('/register', addUser)
router.post('/verify', Authenticateuser, verifyUser)


module.exports = router




