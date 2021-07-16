const express = require('express')
const reviewController = require('.././Controllers/reviewController')
const authController = require('.././Controllers/authController')
const router = express.Router({mergeParams: true})


router.use(authController.protected)

router.route('/')
.get(reviewController.getAllReview)
.post(authController.resticTo('user'), reviewController.creteReview)

router.route('/:id')
.get(reviewController.getReview)
.patch(authController.resticTo('user','admin'),reviewController.updateReview)
.delete(authController.resticTo('user','admin'),reviewController.deleteReview)

module.exports = router;