const express = require('express')
const { adduser } = require('./user.controller')

const router = express.Router()


router.post('/register', adduser)


module.exports = router




