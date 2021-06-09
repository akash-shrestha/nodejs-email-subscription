const express = require('express')

const subscriptionController = require('../controllers/subscription')

const router = express.Router()

router.post('/subscribe', subscriptionController.subscribeUser)
router.get('/add/:token', subscriptionController.addUser)

module.exports = router