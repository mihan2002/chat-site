const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const authController = require("../controller/authController");
const {
  requireAuth,
  authUserdata,
  authPrivetChat,
  authPublicChat,
} = require("../middleware/authMiddleware");

//main
router.get("/", authUserdata, userController.renderMainPage);

//login
router.get("/login", authController.renderLogin);
router.post("/login", authController.handleLogin);

//logout
router.get("/logout", authController.logOut);
//register
router.get("/register", authController.renderRegister);
router.post("/register", authController.handleRegister);

//chat-public
router.get("/public", authPublicChat, userController.handlePublicChat);

//chat-privet
router.get("/privet",authPrivetChat ,userController.renderPrivateChat);
router.post("/privet", userController.handlePrivateChat);

module.exports = router;
