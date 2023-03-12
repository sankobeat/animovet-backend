const expressAsyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const getAnalytics = expressAsyncHandler(async (req, res) => {
  const users = await User.aggregate({ $match: { isAdmin: "true" } });
  res.send(users);
});

module.exports = { getAnalytics };
