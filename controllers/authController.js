const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const User = require("../models/userModel");

const catchAsync = require("../utils/catchAsyncErr");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/email");

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

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to do this action", 403)
      );
    }
    next();
  };
};

const forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("user does not exist", 404));
  }

  const resetToken = user.createResetToken();
  await user.save({ validateBeforeSave: false });
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/reset-password/${resetToken}`;

  const text = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetUrl}. \n ignore if you didnt forget your password`;
  const subject = "YOUR RESET TOKEN (Valid for 10mins)";
  const email = user.email;

  try {
    await sendEmail({ text, subject, email });

    res.status(200).json({
      status: "success",
      message: "reset token has been sent to mail",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    return next(new AppError("Error sending email, try again later", 500));
  }
});

const resetPassword = (req, res, next) => {};

module.exports = {
  signup,
  login,
  protectRoute,
  restrictTo,
  forgotPassword,
  resetPassword,
};