const Tour = require("../models/tourModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsyncErr");

const getOverview = catchAsync(async (req, res) => {
  const tours = await Tour.find();

  res.status(200).render("overview", {
    title: "All Tours",
    tours,
  });
});

const getTour = catchAsync(async (req, res, next) => {
  const { slug } = req.params;

  const tour = await Tour.findOne({ slug }).populate({
    path: "reviews",
    fields: "review rating user",
  });

  if (!tour) return next(new AppError("There is no tour with that name", 404));

  res.status(200).render("tour", {
    title: `${tour.name} Tour`,
    tour,
  });
});

const login = (req, res) => {
  res.status(200).render("login", {
    title: "Log into your account",
  });
};

const signup = (req, res) => {
  res.status(200).render("signup", {
    title: "Signup",
  });
};

const getMe = (req, res) => {
  res.status(200).render("account", {
    title: "My account",
  });
};

const updateUserData = catchAsync(async (req, res, next) => {
  const { email, name } = req.body;
  if (!email || !name)
    return next(
      new AppError("Please provide email or name to be updated", 404)
    );
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, email },
    { new: true, runValidators: true }
  );

  res.status(201).render("account", {
    title: "Your account",
    user,
  });
});

module.exports = { getOverview, getTour, login, signup, getMe, updateUserData };
