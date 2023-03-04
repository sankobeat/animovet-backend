const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    isGuest: {
      type: Boolean,
      default: true,
    },
    name: {
      type: String,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isDone: {
      type: Boolean,
      default: false,
    },
    reservationDate: {
      date: {
        type: String,
        required: true,
      },
      time: {
        type: String,
        required: true,
      },
    },
    petType: {
      type: String,
      required: true,
    },
    caseDescription: {
      type: String,
      default: "No description provided",
    },
  },
  {
    timestamps: true,
  }
);

const Reservation = mongoose.model("Reservation", reservationSchema);

module.exports = Reservation;
