const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    birthday: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default: "/users/default_profile.jpg",
    },
    isSuperAdmin: { type: Boolean, default: false },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isIntern: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
