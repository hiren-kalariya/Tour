exports.deleteOne = Model => async (req, res) => {
    try {
        await Model.findByIdAndDelete(req.params.id)
        res.status(200).json({
            status: "success",
            message: `delete data sucess`
        })
    } catch (error) {
        res.status(200).json({
            status: "fail",
            message:error
        })
    }
}


exports.updateOne = Model => async (req, res) => {

    try {
        const doc = await Model.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        })
        res.status(200).json({
            status: "success",
            data: {
                data:doc
            }
        })
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error
        })
    }
  
}

exports.createOne = Model => async (req, res) => {

    try {
        // const data = new Tour(req.body)
        // const result = await data.save()
        const doc = await Model.create(req.body)
    res.status(200).json({
        status: "success",
        data: {
            data: doc
        }
    })
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error
        })
    }
    
}

exports.getOne = Model => async (req, res) => {
    try {
 
       const doc = await Model.findById(req.params.id)


        res.status(200).json({
            status: "success",
            data:{
                data:doc
            }
        })
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message:error
        })
    }
}

