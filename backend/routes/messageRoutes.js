const express = require("express");
const messageController = require("../controllers/messageController");
const auth = require("../middlewares/auth");
const router = express.Router();

router.route("/:chatId").post(auth.protect, messageController.sendMessage);
router.route("/:chatId").get(auth.protect, messageController.fetchAllChats);

module.exports = router;
