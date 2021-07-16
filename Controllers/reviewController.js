const Review = require('.././Models/reviewModel')
const handlerFactory = require('./handlerFactory')

exports.getAllReview = async (req, res) => {
    let filter = {}

    if(req.params.tourId) filter = {tour:req.params.tourId}
    const reviews = await Review.find(filter);

    res.status(200).json({
        status:"sucess",
        no_of_reviews: reviews.length,
        data:{
            reviews
        }
    })
}

exports.creteReview = async (req, res) => {

    if(!req.body.tour) req.body.tour = req.params.tourId
    if(!req.body.user) req.body.user = req.user._id

    const newReview = await Review.create(req.body)

    res.status(200).json({
        status:"Add review sucecss",
        data:{
            review: newReview
        }
    })
}

exports.getReview = handlerFactory.getOne(Review)
exports.deleteReview = handlerFactory.deleteOne(Review)
exports.updateReview = handlerFactory.updateOne(Review)