const mongoose = require('mongoose')
const Tour = require('./tourModel')
const reviewSchema = new mongoose.Schema({

    review: {
        type: String,
        required: [true, 'review must be required']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'tour',
        required: [true, 'review must belong to tour']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: [true, 'review must belong to user']
    }

},{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

reviewSchema.index({tour:1, user:1},{unique:true})



reviewSchema.statics.calAvrageRating =async function(tourId)
{
        console.log(tourId);
    const state = await this.aggregate([
        {
            $match: {tour : tourId}
        },
        {
            $group:{
                _id : '$tourId',
                nRating : {$sum : 1},
                avgRating: {$avg : '$rating'}
            }
        }
    ])
    console.log(state);
    if(state.length>0)
    
    {
    const updateTour = await Tour.findByIdAndUpdate(tourId,{
        ratingsAverage:state[0].avgRating,
        ratingQan:state[0].nRating
    },{new:true})
    }
    else
    {
        const updateTour = await Tour.findByIdAndUpdate(tourId,{
            ratingsAverage:0,
            ratingQan:4.5
        },{new:true})
    }
    console.log(updateTour);
}

reviewSchema.post('save',function(){
    this.constructor.calAvrageRating(this.tour)
})

reviewSchema.pre(/^findOneAnd/,async function(next)
{
    this.r = await this.findOne()
    console.log(this.r);
    next()
})

reviewSchema.post(/^findOneAnd/,function()
{
    this.r.constructor.calAvrageRating(this.r.tour)
   
})
// reviewSchema.pre(/^find/,function(next){
//     this.populate({
//         path:'user',
//     select:"name photo"   
//  })
//  next();
// })
const Review = mongoose.model('Review',reviewSchema)

module.exports = Review;