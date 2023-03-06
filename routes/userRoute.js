const express = require("express");
const {
  userRegistration,
  userLogin,
  userGetProfile,
  getUserReservationHistory,
  deleteReservation,
  deleteUserAccount,
  makeAdmin,
  getUsers,
} = require("../controllers/userControllers");
const { userAuth, adminAuth, superAdminAuth } = require("../middleware/auth");
const router = express();

router.route("/registration").post(userRegistration);
router.route("/get-users").get(userAuth, getUsers);
router.route("/login").post(userLogin);
router.route("/delete/:id").delete(userAuth, deleteUserAccount);
router.route("/reservation-history").get(userAuth, getUserReservationHistory);
router.route("/deleteReservation/:id").delete(userAuth, deleteReservation);
router.route("/profile").get(userAuth, userGetProfile);
router
  .route("/admin/make-admin")
  .patch(userAuth, adminAuth, superAdminAuth, makeAdmin);

module.exports = router;
