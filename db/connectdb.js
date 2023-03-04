const mongoose = require("mongoose");
const Reservation = require("../models/reservationModel");
const User = require("../models/userModel");
const connectdb = async () => {
  try {
    mongoose.set("strictQuery", false);
    const connect = await mongoose.connect(process.env.MONGO_URI);
    // await Reservation.deleteMany();
    //await User.deleteMany();
    console.log(`mongodb is connected ${connect.connection.host}`);
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

module.exports = { connectdb };
