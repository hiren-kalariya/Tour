// const fs = require('fs');
const Tour = require('../Models/tourModel')
const handlerFactory = require('./handlerFactory')
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/.././dev-data/tour-simple.json`))

exports.aliceTours = (req, res, next) => {
    req.query.sort='-ratingsAverage,price'
    req.query.fields='name,ratingsAverage,price'
    req.query.limit='5'
    next();
}

exports.getTourState = async (req, res) => {
    try {
        const aggregate = await Tour.aggregate([
            {
                 $match: { ratingsAverage : {$lte: 5}}
            },
            {
                $group:
                  {
                   _id:'$difficulty',
                   numTours: {$sum :1},
                    minPrice: { $min: '$price'},
                    maxPrice: { $max: '$price'},
                    avgRating: { $avg: '$ratingsAverage'}
                  }
            },
            {
                 $sort: {ratingsAverage: -1}
            },
            {
                $match: {_id:{$ne: 'easy'}}
            }
        ])

        res.status(200).json({
            status:"sucess",
            data: { 
                aggregate
            }
        })
    } catch (error) {
        res.status(200).json({
            status:"fail",
           message:error
        })
    }
    
}

exports.getMonthlyPlan = async (req, res) => {
    const aggregate = await Tour.aggregate( [
         { 
             $unwind : "$startDates" 
        },
        {
            $match: {startDates: {$gte: new Date('2020-01-01')}}
        },
        {
            $group: {
                _id:{ $month: '$startDates' },
                numOfTours: {$sum : 1},
                name: {$push: '$name'}
            }
        }
    
    ] )
    res.status(200).json({
        status:"sucess",
        data: { 
            aggregate
        }
    })
}

exports.tryAggrigation = async (req, res) => {
   const aggregate = await Tour.aggregate([
    { 
        $unwind: '$startDates' 
    },
    { 
        $group: {
             _id: {$month: '$startDates'}, 
             total: { $sum: 1 } ,
             Tours: { $push:{ name: '$name' ,price: '$price'}}
            } 
    },
    { 
        $addFields: {'month':'$_id' } 
    },
    { 
        $project: { "_id": 0 } 
    },
    { $sort : { month : 1 } }

   ])
    res.status(200).json({
        status:"sucess",
        data: { 
            aggregate
        }
    })

}
exports.getAllTours = async (req, res) => {
    try {
        // 1)simple query
        const  queryObj  = {...req.query};
        const excludeFileds = ['page', 'sort', 'limit', 'fields']
        excludeFileds.forEach(el => delete queryObj[el]);

        console.log(queryObj,req.query)

        // 2)advance query(ex=price[lte]=5)
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(lt|gt|lte|gte)\b/g,el => `$${el}`)
        console.log(JSON.parse(queryStr));
        let query = Tour.find(JSON.parse(queryStr))

        // 3)sorting (ex=>sort=price,name)
        if(req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ')
            query = query.sort(sortBy)
        }
        else {
            query = query.sort('createdAt')
        }

        // 4)filed
        if(req.query.fields) {
            const fileds = req.query.fields.split(',').join(' ')
            query = query.select(fileds)
        }
        else {
            query = query.select('-__v')
        }

        // 5)pagination
        
            const limit = req.query.limit*1 || 100
            const page = req.query.page*1 || 1
            const skip = (page-1)*limit
           
            const TourLength = await Tour.find()
            if(skip >= TourLength.length)
            {
                throw new Error("page not alowd")
            }
            else {

                query = query.skip(skip).limit(limit)
            }
        
        const tours = await query
    res.status(200).json({
        status: "success",
        No_Of_Tours: tours.length,
        data: {
            tours
        }
    })
  } catch (error) {
     throw new Error(error)
  }
   
}

exports.createTour = handlerFactory.createOne(Tour)
// exports.createTour = async (req, res) => {

//     try {
//         // const data = new Tour(req.body)
//         // const result = await data.save()
//         const data = await Tour.create(req.body)
//     res.status(200).json({
//         status: "success",
//         data: {
//             tour: data
//         }
//     })
//     } catch (error) {
//         res.status(404).json({
//             status: "fail",
//             message: error
//         })
//     }
    
// }


exports.getTour = async (req, res) => {
    
    try {
        const id = req.params.id
        const tour = await Tour.findById(id).populate('reviews')
        
        res.status(200).json({
        message: "success",
        data: {
            tour
        }
         })
    } catch (error) {
     res.status(404).json({
        message: "error",
        message:error
    })   
    }
}


exports.updateTour = handlerFactory.updateOne(Tour)
// exports.updateTour = async (req, res) => {

//     try {
//         const tour = await Tour.findByIdAndUpdate(req.params.id,req.body,{
//             new:true,
//             runValidators:true
//         })
//         res.status(200).json({
//             status: "success",
//             data: {
//                 tour
//             }
//         })
//     } catch (error) {
//         res.status(404).json({
//             status: "fail",
//             message: error
//         })
//     }
  
// }

exports.deleteTour = handlerFactory.deleteOne(Tour)
// exports.deleteTour = async (req, res) => {
//     try {
//         await Tour.findByIdAndDelete(req.params.id)
//         res.status(200).json({
//             status: "success",
//             message: "delete tour sucess"
//         })
//     } catch (error) {
//         res.status(200).json({
//             status: "fail",
//             message:error
//         })
//     }
    
// }