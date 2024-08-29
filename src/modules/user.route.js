const express = require('express')
const { Authenticateuser } = require('../middleware/middleware')
const { addUser, verifyUser, addLogin, getUser } = require('./user.controller')

const router = express.Router()

router.get('/getUser', getUser)
router.post('/register', addUser)
router.post('/verify', Authenticateuser, verifyUser)
router.post('/login', addLogin)


module.exports = router




