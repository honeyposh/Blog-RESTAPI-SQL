const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const errorResponse = require("../utils/errorResponse");
exports.signUp = async (req, res, next) => {
  try {
    const { name, username, password, email, role } = req.body;
    const emailExist = await User.findOne({ where: { email } });
    const usernameExist = await User.findOne({ where: { username: username } });
    if (emailExist) {
      return next(new errorResponse("Email Already Exist", 400));
    }
    if (usernameExist) {
      return next(new errorResponse("Username already taken", 400));
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
      role,
    });
    // console.log(user);
    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};
exports.signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(new errorResponse("Invalid credentials", 404));
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return next(new errorResponse("Invalid password", 404));
    }
    const token = jwt.sign(
      { id: user.id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res
      .status(200)
      .cookie("token", token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
      })
      .json({
        success: true,
        id: user._id,
        role: user.role,
      });
  } catch (error) {
    next(error);
  }
};
exports.userProfile = async (req, res, next) => {
  const user = await User.findByPk(req.user.id, {
    attributes: { exclude: ["password"] },
  });
  res.status(200).json({
    success: true,
    user: user,
  });
};
exports.signOut = async (req, res, next) => {
  res.status(200).clearCookie("token").json({
    success: "true",
  });
};
