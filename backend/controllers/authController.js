const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { generateToken } = require("../utils/generateToken");

exports.signup = catchAsync(async (req, res, next) => {
  // 1. To take data from user
  const { name, email, password, picture } = req.body;

  // 2. If no name,email,password then return error
  if (!name || !email || !password) {
    return next(
      new AppError("Please provide name,email and password for user", 401)
    );
  }

  // 3. Check if the user with the given email exists
  const user = await User.findOne({ email });

  if (user) return next(new AppError("User with email already exists", 401));

  const newUser = await User.create({
    name,
    email,
    password,
  });

  if (newUser) {
    const token = generateToken(newUser._id);

    newUser.password = undefined;
    res.status(201).json({
      success: true,
      user: newUser,
      token,
    });
  }
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  const token = generateToken(user._id);

  user.password = undefined;
  res.status(201).json({
    success: true,
    user,
    token,
  });
});
