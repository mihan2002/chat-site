require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Message = require("../models/testmsg");
Message;
const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (error, decodedToken) => {
      if (error) {
        console.log(error.message);
        res.redirect("/login");
      } else {
        console.log(decodedToken);
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
        const user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
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
        const chatHistory = await Message.find({});
        res.locals.username = user;
        res.locals.chatHistory = chatHistory;
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

module.exports = { requireAuth, authUserdata, authPublicChat };
