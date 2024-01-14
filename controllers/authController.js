const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsyncErr");
const AppError = require("../utils/appError");
const { promisify } = require("util");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

const signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;

  const newUser = await User.create({ name, email, password, passwordConfirm });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.isCorrectPassword(password, user.password))) {
    return next(
      new AppError("The email or password is incorrect", 401) // 401 means unauthorized
    );
  }

  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    token,
  });
});

const protectRoute = catchAsync(async (req, res, next) => {
  let token = "";
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in, please log in to get access", 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id);

  if (!user) return next(new AppError("The user no longer exists", 401));

  if (user.isPasswordChangedAfter(decoded.iat))
    return next("User has changed password recently, please log in again", 401);

  req.user = user;
  next();
});

module.exports = { signup, login, protectRoute };
