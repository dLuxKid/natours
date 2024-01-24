const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsyncErr");
const { createAndSendToken } = require("./authController");
const { deleteOne, updateOne, getOne, getAll } = require("./handlerFactory");

const getMe = (req, res, next) => {
  req.params.id = req.user.id;

  next();
};

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

const setUserInactive = catchAsync(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

const getAllUsers = getAll(User);
const getUser = getOne(User);
const updateUser = updateOne(User);
const deleteUser = deleteOne(User);

module.exports = {
  getAllUsers,
  getUser,
  getMe,
  updateUser,
  deleteUser,
  updateUserDetails,
  setUserInactive,
};
