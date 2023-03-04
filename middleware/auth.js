const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const dotenv = require("dotenv");

dotenv.config();
const userAuth = expressAsyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    next();
  } else {
    res.status(500);
    throw new Error("You are not authorized!");
  }
});

const adminAuth = expressAsyncHandler(async (req, res, next) => {
  if (req.user.isAdmin !== true) {
    throw new Error("You are not an admin");
  } else {
    next();
  }
});

const superAdminAuth = expressAsyncHandler(async (req, res, next) => {
  if (req.user.isSuperAdmin !== true) {
    throw new Error("You are not allowed");
  } else {
    next();
  }
});

module.exports = { userAuth, adminAuth, superAdminAuth };
