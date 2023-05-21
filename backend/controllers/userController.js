const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

exports.getUsers = catchAsync(async (req, res, next) => {
  console.log(req.query.search);

  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });

  res.status(200).json({
    success: true,
    results: users.length,
    users,
  });
});
