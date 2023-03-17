const expressAsyncHandler = require("express-async-handler");
const Reservation = require("../models/reservationModel");
const User = require("../models/userModel");

const getAnalytics = expressAsyncHandler(async (req, res) => {
  const reservationInMonth = await Reservation.aggregate([
    { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },
  ]);

  const reservationFrom = await Reservation.aggregate([
    { $group: { _id: "$isGuest", count: { $sum: 1 } } },
    { $project: { isGuest: "$_id", count: 1, _id: 0 } },
  ]);

  res.status(200).json({ reservationFrom, reservationInMonth });
});

module.exports = { getAnalytics };
