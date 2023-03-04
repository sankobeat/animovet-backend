const express = require("express");
const {
  sendMessages,
  getMessages,
} = require("../controllers/messagesControllers");
const { userAuth, adminAuth } = require("../middleware/auth");
const router = express.Router();

router.route("/").get(userAuth, adminAuth, getMessages);
router.route("/send").post(sendMessages);

module.exports = router;
