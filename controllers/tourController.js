const fs = require("fs");

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

const checkId = (req, res, next, val) => {
  const id = req.params.id * 1;

  if (id >= tours.length) {
    return res.status(404).json({
      status: "fail",
      message: "Could not find the tour you are looking for",
    });
  }
  next();
};

const checkBody = (req, res, next) => {
  const { name, price } = req.body;
  if (!name || !price) {
    return res.status(400).json({
      status: "fail",
      message: "No name or price in body of request",
    });
  }
  next();
};

const getAllTours = (req, res) => {
  res.status(200).json({
    // using jsend format for sending response from apis
    status: "success",
    requestedAt: req.requesTime,
    results: tours.length,
    data: { tours },
  });
};

const getTourById = (req, res) => {
  const id = req.params.id * 1;

  const tour = tours.find((tour) => tour.id === id);

  res.status(200).json({
    status: "success",
    data: { tour },
  });
};

const addNewTour = (req, res) => {
  const newId = tours[tours.length - 1] + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  const id = req.params.id * 1;

  res.status(200).json({
    status: "success",
    data: {
      tour: "tour has been updated",
    },
  });
};

const deleteTour = (req, res) => {
  const id = req.params.id * 1;

  const filteredTours = tours.filter((tour) => tour.id !== id);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple-copy.json`,
    JSON.stringify(filteredTours),
    (err) => {
      res.status(201).json({
        status: "success",
        data: null,
      });
    }
  );
};

module.exports = {
  checkId,
  checkBody,
  addNewTour,
  deleteTour,
  updateTour,
  getAllTours,
  getTourById,
};
