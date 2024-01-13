const express = require("express");
const morgan = require("morgan");

const AppError = require("./utils/appError");

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const { handleErr } = require("./controllers/errorController");

const app = express();

// creating our middleware stack
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// routes
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`cannot find ${req.originalUrl} on this server`, 404));
});

app.use(handleErr);

module.exports = { app };
