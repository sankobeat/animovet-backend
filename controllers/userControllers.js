const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcryptjs = require("bcryptjs");
const User = require("../models/userModel");
const Reservation = require("../models/reservationModel");
const { isValidDate } = require("../utils/validateDate");
dotenv.config();

// @ url : api/register
// @ privacy : public

const userRegistration = expressAsyncHandler(async (req, res) => {
  const { name, email, password, phoneNumber, birthday } = req.body;

  const bd = birthday.split("-");
  const currentYear = new Date().getFullYear();

  if (Number(bd[2]) < 1900 || Number(bd[2]) > currentYear - 16) {
    res.status(500);
    throw new Error("Veuillez entrer une date de naissance valide !");
  }

  if (!isValidDate(Number(bd[2]), Number(bd[1]), Number(bd[0]))) {
    res.status(500);
    throw new Error("Veuillez entrer une date de naissance valide !");
  }

  const alreadyExist = await User.findOne({ email });

  if (alreadyExist) {
    res.status(401);
    throw new Error("This email already exist");
  }

  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(password, salt);

  const createNewUser = await User.create({
    userName: name,
    email,
    password: hashedPassword,
    phoneNumber,
    birthday,
  });

  const user = await User.findOne({ _id: createNewUser._id }).select(
    "_id userName birthday phoneNumber isIntern isAdmin"
  );
  const id = user._id;
  const generateToken = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  const userDetails = {
    _id: user._id,
    name: user.userName,
    isAdmin: user.isAdmin,
    isSuperAdmin: user.isSuperAdmin,
  };

  const accessToken = generateToken;

  if (createNewUser) {
    res.status(201);
    res.json({ user: userDetails, token: accessToken });
  }
});

// @ url : api/login
// @ privacy : public

const userLogin = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("Cet email n'existe pas.");
  }

  if (user && !(await bcryptjs.compare(password, user.password))) {
    res.status(500);
    throw new Error("Votre mot de passe est incorrect.");
  }

  if (user && (await bcryptjs.compare(password, user.password))) {
    const id = user._id;
    const generateToken = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });
    const userDetails = {
      _id: user._id,
      name: user.userName,
      isAdmin: user.isAdmin,
      isSuperAdmin: user.isSuperAdmin,
    };

    res.status(200).json({ user: userDetails, token: generateToken });
  }
});

// api => http://localhost:5000/api/user/all
const getAllUsers = expressAsyncHandler(async (req, res) => {
  const users = await User.find({});
  res.status(200).send(users);
});

// api => http://localhost:5000/api/user/${id}

const userGetProfile = expressAsyncHandler(async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    throw new Error("Vous n'êtes pas autorisé");
  }
  const user = await User.findById(userId).select("-password");
  const reservations = await Reservation.find({ user: userId });
  res.json({ user, reservations });
});

const getUsers = expressAsyncHandler(async (req, res) => {
  const { page } = req.query;
  const { keyword } = req.query ? req.query : "";

  if (!(keyword === "")) {
    const query = {
      $or: [{ userName: { $regex: keyword, $options: "i" } }],
      $or: [{ email: { $regex: keyword, $options: "i" } }],
    };
    const count = await User.countDocuments(query);
    const limitUsersToShow = 5;
    const pages = Math.ceil(count / limitUsersToShow);
    const skip = (page - 1) * limitUsersToShow;
    const userToSend = await User.find(query)
      .skip(skip)
      .limit(limitUsersToShow);
    res.json({ userToSend, pageNumber: page, pages });
  }

  const usersCount = await User.count();
  const limitUsersToShow = 5;
  const pages = Math.ceil(usersCount / limitUsersToShow);
  const skip = (page - 1) * limitUsersToShow;
  const userToSend = await User.find({}).skip(skip).limit(limitUsersToShow);

  res.json({ userToSend, pageNumber: page, pages });
});

const getUserReservationHistory = expressAsyncHandler(async (req, res) => {
  const reservations = await Reservation.find({ user: req.user._id });

  res.status(200).send(reservations);
});

const deleteReservation = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  const reservationToDelete = await Reservation.findById(id);
  if (!(reservationToDelete.user.toString() === req.user._id.toString())) {
    throw new Error("Vous n'êtes pas autorisé");
  }

  reservationToDelete.delete();

  res.send("La réservation a été supprimée !");
});
const deleteUserAccount = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const userid = req.user._id;
  console.log(id, req.user);
  if (id.toString() === userid.toString()) {
    await User.findByIdAndDelete(id);
    res.status(200).send("Utilisateur supprimé !");
  } else {
    throw new Error("Vous n'êtes pas autorisé");
  }
});

const makeAdmin = expressAsyncHandler(async (req, res) => {
  const { id } = req.body;
  if (id.toString() === req.user._id.toString()) {
    throw new Error("Vous ne pouvez pas effectuer cette action.");
  }
  const user = await User.findById(id);

  if (user) {
    user.isAdmin = !user.isAdmin;
    await user.save();
    res.sendStatus(200);
  }
});

module.exports = {
  getUsers,
  userRegistration,
  userLogin,
  userGetProfile,
  getAllUsers,
  getUserReservationHistory,
  deleteReservation,
  deleteUserAccount,
  makeAdmin,
};
