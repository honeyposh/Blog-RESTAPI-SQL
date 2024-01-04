const errorResponse = require("../utils/errorResponse");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
exports.isAuthorized = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return next(new errorResponse("you must login", 401));
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByPk(decodedToken.id);
    // console.log(req.user.name);
    if (!req.user) {
      return next(new errorResponse("This user no longer exists", 401));
    }
    // console.log(req.user);
    next();
  } catch (error) {
    return next(new errorResponse("you must login", 401));
  }
};
exports.isAdmin = (req, res, next) => {
  if (req.user.role === "user") {
    return next(new errorResponse("Access denied, you must an admin", 401));
  }
  next();
};
