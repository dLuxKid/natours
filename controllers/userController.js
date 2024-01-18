const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsyncErr");
const { createAndSendToken } = require("./authController");

const getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find({});
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

const updateUserDetails = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm)
    return next(new AppError("You cannot update password on this route", 400));

  const user = {
    email: req.body.email || req.user.email,
    name: req.body.name || req.user.name,
  };

  const updatedUser = await User.findByIdAndUpdate(req.user._id, user, {
    new: true,
    runValidators: true,
  });

  createAndSendToken(updatedUser, 201, res);
});

const setUserInactive = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

const createUser = (req, res) => {};

const getUser = (req, res) => {};

const updateUser = (req, res) => {};

const deleteUser = (req, res) => {};

module.exports = {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateUser,
  updateUserDetails,
  setUserInactive,
};
