const fs = require("fs");
const express = require("express");

const app = express();
app.use(express.json()); // middleware

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  res.status(200).json({
    // using jsend format for sending response from apis
    status: "success",
    results: tours.length,
    data: { tours },
  });
};

const getTourById = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((tour) => tour.id === id);

  if (!tour) {
    return res.status(404).json({
      status: "fail",
      message: "Could not find the tour you are looking for",
    });
  }

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

  if (id >= tours.length) {
    return res.status(404).json({
      status: "fail",
      message: "Could not find the tour you are looking for",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      tour: "tour has been updated",
    },
  });
};

const deleteTour = (req, res) => {
  const id = req.params.id * 1;

  if (id >= tours.length) {
    return res.status(404).json({
      status: "fail",
      message: "Could not find the tour you are looking for",
    });
  }

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

// app.get("/api/v1/tours", getAllTours);
// app.post("/api/v1/tours", addNewTour);
app.route("/api/v1/tours").get(getAllTours).post(addNewTour);

app
  .route("/api/v1/tours/:id")
  .get(getTourById)
  .patch(updateTour)
  .delete(deleteTour);
// app.get("/api/v1/tours/:id", getTourById);
// app.patch("/api/v1/tours/:id", updateTour);
// app.delete("/api/v1/tours/:id", deleteTour);

app.listen(3000, () => {
  console.log("We on some express juice");
});
