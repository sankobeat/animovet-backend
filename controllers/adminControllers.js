const expressAsyncHandler = require("express-async-handler");
const Notification = require("../models/notificationModel");
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

// Create Notifications

const createNotification = expressAsyncHandler(async (req, res) => {
  const { notificationType, name, senderId } = req.body;
  const admins = await User.find({ isAdmin: true }).select("_id");

  if (senderId) {
    await Notification.create({
      notificationType,
      name,
      senderId,
      receiverIds: admins,
    });
  } else {
    await Notification.create({
      notificationType,
      name,
      receiverIds: admins,
    });
  }

  res.status(201).json({ message: "Admin has been notified" });
});

const getNotification = expressAsyncHandler(async (req, res) => {
  const notification = await Notification.find({});

  res.status(201).json(notification);
});

module.exports = { getAnalytics, createNotification, getNotification };
