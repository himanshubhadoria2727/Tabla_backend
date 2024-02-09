const express = require('express')
const { Authenticateuser } = require('../../middleware/middleware')
const { addPlan, getPlan, deletedPlan } = require('./plan.controller')

const router = express.Router()

router.post('/addplan', Authenticateuser, addPlan)
router.get('/getPlan', getPlan)
router.delete('/:id', deletedPlan)




module.exports = router

