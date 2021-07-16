const express = require('express')
const view = require('.././Controllers/viewController')
const router = express.Router()


router.get('/',view.overview)
router.get('/tour/:id',view.getTour)

module.exports = router