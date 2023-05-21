const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const chatController = require("../controllers/chatController");

router.route("/").post(auth.protect, chatController.accessChat);
router.route("/").get(auth.protect, chatController.fetchAllChats);
router.route("/group").post(auth.protect, chatController.createGroupChat);
router
  .route("/group/rename/:groupId")
  .patch(auth.protect, chatController.renameGroup);
router
  .route("/group/:groupId/adduser/:userId")
  .patch(auth.protect, chatController.addUserToGroup);
router
  .route("/group/:groupId/removeuser/:userId")
  .patch(auth.protect, chatController.removeFromGroup);

module.exports = router;
