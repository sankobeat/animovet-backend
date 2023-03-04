const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderName: {
      type: String,
      required: true,
    },
    senderEmail: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Messages", messageSchema);

module.exports = Message;
