const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsyncErr");

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

const createUser = (req, res) => {};

const getUser = (req, res) => {};

const updateUser = (req, res) => {};

const deleteUser = (req, res) => {};

module.exports = { getAllUsers, createUser, getUser, updateUser, deleteUser };
