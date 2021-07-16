const path = require ('path')
const express = require('express');
const ejs = require('ejs')
const mongoose = require('mongoose');
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean')
const hpp = require('hpp');
const tourRouter = require('./Routers/tourRouter')
const userRouter = require('./Routers/userRouter')
const reviewRouter = require('./Routers/reviewRouter')
const viewRouter = require('./Routers/viewRouter')
require('dotenv').config()
const app = express();
app.use(helmet());

const limiter = rateLimit({
    windowMs: 30 * 60 * 1000, // 30 minutes
    max: 100, // limit each IP to 100 requests per windowMs  ,
    message:"Too many request send from this IP, please try again after an half and hour"
});


app.use(limiter);


const staticPath=path.join(__dirname,'./public')
app.use(express.json())
app.set('view engine', 'ejs')



app.use(mongoSanitize())
app.use(xss())
app.use( hpp({ whitelist: [ 'ratingsAverage', 'duration', 'name', 'maxGroupSize', 'difficulty', 'price', '' ] }));

app.use(express.static(staticPath))

mongoose.connect(process.env.DB, { useNewUrlParser: true,
useUnifiedTopology: true,
useFindAndModify: false,
useCreateIndex: true})
.then(() => {
    console.log("data base connect sucessfully");
})
.catch((err) => {
    console.log(err);
})



app.use(viewRouter)
app.use("/api/v1/tours",tourRouter)
app.use("/api/v1/users",userRouter)
app.use("/api/v1/reviews",reviewRouter)

// app.get('*', (req, res, next) => {
//     throw new Error('BROKEN')
// })

app.use(function (err, req, res, next) {
    console.error(err.message)
    res.status(404).send({
        status:"fail",
        message:err.message
    })
  })
port=process.env.PORT || 8080
app.listen(port,() => {
    console.log(`server stsrt on ${port}`);
})