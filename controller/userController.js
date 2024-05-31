const User = require("../models/user");
const Msges = require("../models/testmsg");
const GetMessageModel = require("../models/message");

exports.renderEnterPage = (req, res) => {
  res.render("enterPage");
};

exports.renderMainPage = async (req, res) => {
  const users = await User.find({});
  const user = req.cookies.user;

  res.render("main", { users, user });
};

exports.renderLogin = (req, res) => {
  res.render("login");
};

exports.handleLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || user.password !== password) {
    return res.send("Invalid username or password");
  }

  res.cookie(
    "user",
    {
      _id: user._id,
      username: user.username,
      email: user.email,
    },
    { httpOnly: true }
  );
  res.redirect("/main");
};

exports.handlePublicChat = async (req, res) => {
  const user = req.cookies.user;
  const msgs = await Msges.find({});
  res.render("publicChat", { username: user.username, chatHistory: msgs });
};

exports.handlePrivateChat = async (req, res) => {
  const { room } = req.body;
  const Message = await GetMessageModel(room).find({});
  const user = req.cookies.user;
  res.render("privateChat", { room: room, username: user.username ,chatHistory:Message});
};

exports.renderRegister = (req, res) => {
  res.render("register");
};

exports.handleRegister = async (req, res) => {
  const { username, password, email } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).send("Email already in use");
  }

  try {
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.redirect("/login");
  } catch (err) {
    console.error("Error saving user to database:", err);
    res.status(500).send("Error saving user to database");
  }
};
