const express = require("express");
const { getAnalytics } = require("../controllers/adminControllers");
const { userAuth, adminAuth, superAdminAuth } = require("../middleware/auth");
const router = express();

router.route("/analytics").get(getAnalytics);

module.exports = router;
