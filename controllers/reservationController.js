const expressAsyncHandlder = require("express-async-handler");
const Reservation = require("../models/reservationModel");
const User = require("../models/userModel");

const reserve = expressAsyncHandlder(async (req, res) => {
  const {
    id,
    name,
    phoneNumber,
    petType,
    reservedDate,
    reservedTime,
    description,
  } = req.body;
  const date = new Date(reservedDate);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const whatDate = date.getDate();
  const reservedDateFormat = `${year.toString()}-${month.toString()}-${whatDate.toString()}`;

  const reservedDatAlreadyExist = await Reservation.findOne({
    "reservationDate.date": reservedDateFormat,
    "reservationDate.time": reservedTime,
  });
  if (reservedDatAlreadyExist) {
    throw new Error(
      "This date and time are already reserved!, Please choose a deffrent time."
    );
  }

  if (!reservedDate || !reservedTime) {
    res.status(500);
    throw new Error("Veuillez remplir tous les champs.");
  }
  if (id) {
    if (!reservedDate || !reservedTime) {
      res.status(500);
      throw new Error("Veuillez remplir tous les champs.");
    }
    const user = await User.findById(id);

    const newReservation = await Reservation.create({
      user: id,
      name: user.userName,
      petType: petType,
      phoneNumber: user.phoneNumber,
      reservationDate: {
        date: reservedDateFormat,
        time: reservedTime,
      },
      caseDescription: description,
      isGuest: false,
    });
    newReservation.save();

    res.status(201).send(newReservation);
  } else {
    if (!name || !phoneNumber || !reservedDate || !reservedTime) {
      res.status(500);
      throw new Error("Veuillez remplir tous les champs.");
    }
    const newReservation = await Reservation.create({
      name: name,
      petType: petType,
      phoneNumber: phoneNumber,
      reservationDate: {
        date: reservedDateFormat,
        time: reservedTime,
      },
      caseDescription: description,
    });
    newReservation.save();

    res.status(201).send(newReservation);
  }
});

const getReservedTimes = expressAsyncHandlder(async (req, res) => {
  const { date } = req.body;

  const newDate = new Date(date);
  const year = newDate.getFullYear();
  const month = newDate.getMonth() + 1;
  const whatDate = newDate.getDate();
  const searchDate = `${year.toString()}-${month.toString()}-${whatDate.toString()}`;

  const reservedTimes = await Reservation.find({
    "reservationDate.date": searchDate,
  }).select("reservationDate.time");

  res.status(200).send(reservedTimes);
});

const getSingleReservation = expressAsyncHandlder(async (req, res) => {
  const { id } = req.params;

  const reservation = await Reservation.findById(id);
  res.send(reservation);
});

const getAllReservations = expressAsyncHandlder(async (req, res) => {
  const reservations = await Reservation.find({});

  res.status(200).send(reservations);
});

const approveReservation = expressAsyncHandlder(async (req, res) => {
  const { id } = req.body;

  const reservation = await Reservation.findById(id);
  if (reservation.isDone && reservation.isApproved) {
    throw new Error(
      "Vous ne pouvez pas refuser une réservation déjà effectuée !"
    );
  }
  reservation.isApproved = !reservation.isApproved;

  await reservation.save();

  res.status(200).send("Réservation mise à jour!");
});

const doneReservation = expressAsyncHandlder(async (req, res) => {
  const { id } = req.body;

  const reservation = await Reservation.findById(id);

  if (reservation.isApproved === true) {
    reservation.isDone = !reservation.isDone;
    await reservation.save();
    res.status(200).send("Réservation mise à jour!");
  } else {
    res.status(500);
    throw new Error("La réservation doit être approuvée en premier !");
  }
});

const adminDeleteReservation = expressAsyncHandlder(async (req, res) => {
  const { id } = req.params;

  if (id) {
    await Reservation.findByIdAndRemove(id);
    res.status(200).send("Réservation supprimée !");
  } else {
    throw new Error("Il y a eu une erreur !");
  }
});

module.exports = {
  reserve,
  getReservedTimes,
  getSingleReservation,
  getAllReservations,
  approveReservation,
  doneReservation,
  adminDeleteReservation,
};
