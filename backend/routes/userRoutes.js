const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const auth = require("../middlewares/auth");

router.get("/", auth.protect, userController.getUsers);
router.post("/signup", authController.signup);
router.post("/login", authController.login);

module.exports = router;
