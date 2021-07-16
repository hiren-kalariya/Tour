const tour = require('.././Models/tourModel')


exports.overview = async (req, res) => {
    const tours = await tour.find()
    // console.log(tours[1].startLocation.description);
    res.status(200).render('overview',{tours})
}

exports.getTour = async (req, res) => {
    const id = req.params.id;
    console.log(id);
    const tourdata = await tour.findOne({_id:id}).populate('reviews')
   
    console.log(tourdata);
    res.status(404).render('tour',{tourdata})
}