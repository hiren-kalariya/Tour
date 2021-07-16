const mongoose = require('mongoose')
const validator = require('validator')

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Tour name must be required'],
        unique: [true, 'Tour name must be unique'],
        trim: true,
        validate: [validator.isAlpha, "name must be in string"]
    },
    duration: {
        type: Number,
        required: [true, 'Tour must  have duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'Tour must have a group size']
    },
    difficulty: {
        type: String,
        required: [true, 'Tour must have difficulty'],
        enum: ['easy', 'medium', 'difficult']
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        max: 5,
        min :1,
        set: val => Math.round(val*10)/10
    },
    ratingQan: {
        typa: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'Tour must  have price']
    },
    priceDiscount: {
        type: Number,
        validate: function(val) {
            return val <this.price
        }
    },
    summary: {
        type: String,
        trim: true,
        required: [true, 'Tour must have summary']
    },
    description :{
        type: String,
        trim: true
    },
    guides:[
        {
            type:mongoose.Schema.ObjectId,
            ref:'user'
        }
    ],
    startLocation: {
        // GeoJSON
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
      },
      locations: [
        {
          type: {
            type: String,
            default: 'Point',
            enum: ['Point']
          },
          coordinates: [Number],
          address: String,
          description: String,
          day: Number
        }
      ],
    imageCover: {
        type: String,
        required: [true, 'tour must  have a cover image']
    },
    images: [String],
    startDates: [Date]
}
,{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
}
)

tourSchema.index({price:1 ,ratingsAverage:-1})
tourSchema.index({startLocation:'2dphere'})

tourSchema.virtual('durationWeek').get(function() {
    return this.duration/7;
  });

  tourSchema.virtual('reviews',{
      ref:'Review',
      foreignField: 'tour',
      localField: '_id'
  });


  tourSchema.pre(/^find/, function(next) {
    this.populate({
        path:"guides",
        select: '-__v'
    })
      next();
  })

//   tourSchema.post(/^find/, function() {
//     console.log("post find fucntion...");
//     console.log(Date.now()-this.start);
    
// })
const Tour = mongoose.model('tour', tourSchema)

module.exports = Tour