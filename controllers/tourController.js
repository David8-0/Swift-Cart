const fs = require('fs');


const toursSmiplePath = `${__dirname}/../dev-data/data/tours-simple.json`;
const tours = JSON.parse(fs.readFileSync(toursSmiplePath));

exports.checkID = function(req,res,next,val){
  const id = val*1;
    const tour = tours.find((t) => t.id === id);
    if (!tour) {
      return res.status(404).json({
        status: 'fail',
        message: 'invalid id',
      });
    } 
    next();
}
exports.checkForTourInfo = function(req,res,next){
  if(!req.body.name || !req.body.duration){
    return res.status(400).json({
      status: 'fail',
      message:'name and duration must be specified'
    });
  }
  next();
}
exports.getAllTours=function(req, res) {
    res.status(200).json({
      status: 200,
      RequestTime: req.requestTime,
      Results: tours.length,
      tours,
    });
  }
  exports.addNewTour=function(req, res) {
    const newTourId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newTourId }, req.body);
    tours.push(newTour);
    fs.writeFile(toursSmiplePath, JSON.stringify(tours), (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    });
  }
  exports.getTourById=function(req, res) {
    const id = req.params.id * 1;
    const tour = tours.find((tour) => tour.id === id);
      res.status(200).json({
        status: 'success',
        data: {
          tour,
        },
      });
  }
