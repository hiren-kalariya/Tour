const fs = require('fs');
const mongoose = require('mongoose');
const Tour = require('../Models/tourModel')
const User = require('../Models/userModel')
const Review = require('../Models/reviewModel')

mongoose.connect("mongodb://localhost/natours", { useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true})
  .then(() => {
      console.log("data base connect sucessfully");
  })
  .catch((err) => {
      console.log(err);
  })


const tour_data=JSON.parse(fs.readFileSync(`${__dirname}/tours.json`,"utf-8"))
const user_data=JSON.parse(fs.readFileSync(`${__dirname}/users.json`,"utf-8"))
const review_data=JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`,"utf-8"))

const importData = async() => {

  try {
    await Tour.create(tour_data,{validateBeforeSave:false})
    await User.create(user_data,{validateBeforeSave:false})
    await Review.create(review_data,{validateBeforeSave:false})
  console.log('data import sucessfully');
  process.exit();
  } catch (error) {
    console.log(error);
  }
  
}

const deleteData = async() => {

  try {
    await Tour.deleteMany()
    await User.deleteMany()
    await Review.deleteMany()
    console.log('delete data sucessfully');
    process.exit();
  } catch (error) {
    console.log(error);
  }
 
}

console.log(process.argv);

if(process.argv[2] == '--import') {
  importData();
}


if(process.argv[2] == '--delete') {
  deleteData();
}

