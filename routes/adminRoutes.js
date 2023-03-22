const express = require("express");
const {
  getAnalytics,
  createNotification,
  getNotification,
} = require("../controllers/adminControllers");
const { userAuth, adminAuth, superAdminAuth } = require("../middleware/auth");
const router = express();

router.route("/analytics").get(getAnalytics);
router
  .route("/notification")
  .post(createNotification)
  .get(userAuth, adminAuth, getNotification);

module.exports = router;
