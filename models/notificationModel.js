const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    notificationType: {
      type: String,
      enum: ["register", "reserved"],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    receiverIds: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      default: null,
    },
    isSeen: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
