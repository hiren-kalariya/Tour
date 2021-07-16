const express = require('express')
const router = express.Router()
const tourController = require('../Controllers/tourController')
const authController = require('../Controllers/authController')
// const reviewController = require('../Controllers/reviewController')
const reviewRouter = require('./reviewRouter')



router.use('/:tourId/review',reviewRouter)

router.route('/top-5-chep').get(tourController.aliceTours,tourController.getAllTours)

router.get('/tours-state',tourController.getTourState)
router.get('/monthly-tour',authController.protected,authController.resticTo('admin' ,'lead-guide','guide'),tourController.getMonthlyPlan)
router.get('/try-tour',tourController.tryAggrigation)

router.route('/')
.get(tourController.getAllTours)
.post(authController.protected,authController.resticTo('admin' ,'lead-guide'),tourController.createTour)


router.route('/:id')
.get(tourController.getTour)
.patch(authController.protected,authController.resticTo('admin' ,'lead-guide'),tourController.updateTour)
.delete(authController.protected,authController.resticTo('admin'),tourController.deleteTour)



// router.route('/:tourId/review')
// .post(authController.protected,authController.resticTo('user'),reviewController.creteReview)


module.exports=router;