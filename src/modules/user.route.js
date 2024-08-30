const express = require('express')
const { Authenticateuser } = require('../middleware/middleware')
const { addUser, verifyUser, addLogin, getUser,getUserDetails,updateUser } = require('./user.controller')

const router = express.Router()

router.get('/getUser', getUser)
router.get('/getUserDetails', getUserDetails)
router.post('/register', addUser)
router.post('/updateUser',Authenticateuser, updateUser)
router.post('/verify', Authenticateuser, verifyUser)
router.post('/', addLogin)


module.exports = router




