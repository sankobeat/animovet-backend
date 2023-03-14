const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later",
});

module.exports = { limiter };
