const express = require("express");
const {
  reserve,
  getReservedTimes,
  getSingleReservation,
  getAllReservations,
  approveReservation,
  doneReservation,
  adminDeleteReservation,
} = require("../controllers/reservationController");
const { userAuth, adminAuth } = require("../middleware/auth");
const router = express.Router();

router.route("/register").post(reserve);
router.route("/reserved-times").post(getReservedTimes);
router.route("/approved").patch(userAuth, adminAuth, approveReservation);
router.route("/done").patch(userAuth, adminAuth, doneReservation);
router.route("/delete/:id").delete(userAuth, adminAuth, adminDeleteReservation);
router.route("/all").get(userAuth, adminAuth, getAllReservations);
router.route("/:id").get(getSingleReservation);

module.exports = router;
