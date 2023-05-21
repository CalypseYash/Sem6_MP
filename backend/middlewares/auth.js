const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const { promisify } = require("util");
const AppError = require("../utils/appError");
const User = require("../models/userModel");

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(
      new AppError("You are not logged in. Please login to get access!", 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    return next(
      new AppError("The user belonging to the token does not exist", 401)
    );

  //Grant access to protected route
  req.user = currentUser;

  next();
});
