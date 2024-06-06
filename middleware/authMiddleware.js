require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const PublicChatMessageModel = require("../models/testmsg");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (error, decodedToken) => {
      if (error) {
        console.log(error.message);
        res.redirect("/login");
      } else {
        res.locals._id = decodedToken.id;
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

const authUserdata = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (error, decodedToken) => {
      if (error) {
        console.log(error.message);
        res.locals.user = null;
        next();
      } else {
        try {
          const user = await User.getFriendRequests(decodedToken.id);
          if (user) {
            console.log(user);
            user._id = decodedToken.id;
            res.locals.user = user;
          }
          next();
        } catch (error) {
          console.log(error);
          res.locals.user = null;
          next();
        }
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

const authPublicChat = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (error, decodedToken) => {
      if (error) {
        console.log(error.message);
        res.redirect("/login");
      } else {
        const user = await User.findById(decodedToken.id);
        const publicChat = await PublicChatMessageModel.find({});

        res.locals.username = user.username;
        res.locals.chatHistory = publicChat;
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

const authPrivetChat = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (error, decodedToken) => {
      if (error) {
        console.log(error.message);
        res.redirect("/login");
      } else {
        const user = await User.findById(decodedToken.id).populate("friends");
        res.locals.owner = user;
        res.locals.users = user.friends;
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};
authPrivetChat;
module.exports = { requireAuth, authUserdata, authPublicChat, authPrivetChat };
