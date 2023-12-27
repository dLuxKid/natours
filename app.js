const express = require("express");
const morgan = require("morgan");

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

// creating our middleware stack
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static("./public"));
app.use((req, res, next) => {
  console.log("hello from the middleware");
  req.requesTime = new Date().toISOString();
  next();
});

// routes
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

module.exports = { app };
