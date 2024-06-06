const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const authController = require("../controller/authController");
const friendController = require("../controller/friendController");
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
router.get("/public", authPublicChat, userController.renderPublicChat);

//chat-privet
router.get("/privet", authPrivetChat, userController.renderPrivateChat);
router.post("/privet", requireAuth, userController.handlePrivateChat);

//add friend
router.get("/add-friend", requireAuth, friendController.renderSearchPage);
router.get("/accept-friend",authUserdata, friendController.renderRequestPage);

router.post("/show-users", requireAuth, friendController.handleSearchChat);
router.post("/add-friend", requireAuth, friendController.sendFriendReq);
router.post("/accept-decline-friend", requireAuth, friendController.acceptOrDeclineRequest);


module.exports = router;
