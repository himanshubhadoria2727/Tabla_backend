const express = require('express')
const { addPlan, getPlan, deletedPlan } = require('./plan.controller')

const router = express.Router()

router.post('/addplan', addPlan)
router.get('/getPlan', getPlan)
router.delete('/:id', deletedPlan)




module.exports = router

