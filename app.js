const path = require("path");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const sanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const parser = require("cookie-parser");

const AppError = require("./utils/appError");

const { handleErr } = require("./controllers/errorController");

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const viewRouter = require("./routes/viewRoutes");
const bookingRouter = require("./routes/bookingRoutes");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// creating our global middleware stack
app.use(helmet()); // set security http headers

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an our",
});

app.use("/api", limiter); // affects all route with /api and does not allow more than 100 requests per hour

app.use(sanitize()); // data sanitization against NoSql query injection
app.use(xss()); // data sanitization against cross site scripting
app.use(
  hpp({
    // whitelist contains array of allowed parameter to ignore if they have duplicate
    whitelist: [
      "duration",
      "ratingsQuantitiy",
      "ratingsAverage",
      "maxGroupSize",
      "difficuly",
    ],
  })
); // prevent parameter pollution

app.use(express.json({ limit: "10kb" })); // will not accept any data larger than 10kb as body
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(parser());
app.use(express.static(path.join(__dirname, "public"))); // serving static files

// routes
app.use("/", viewRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/booking", bookingRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`cannot find ${req.originalUrl} on this server`, 404));
});

app.use(handleErr);

module.exports = app;
