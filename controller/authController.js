require("dotenv").config();
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const handleErrors = (err) => {
  let error = { email: "", password: "" };

  if (err.message === "incorrect email") {
    error.email = "this email is not registered";
  }
  if (err.message === "incorrect password") {
    error.email = "this password is incorrect";
  }

  //duplicate error code
  if (err.code === 11000) {
    error.email = "Email is already in use";
    return error;
  }
  if (err.message.includes("User validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      error[properties.path] = properties.message;
    });
  }

  return error;
};

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: maxAge });
};

exports.renderRegister = (req, res) => {
  res.render("register");
};

exports.handleRegister = async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const newUser = await User.create({ username, email, password });
    const token = createToken(newUser._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: newUser._id });
  } catch (err) {
    const error = handleErrors(err);
    res.status(400).json({ error });
  }
};

//login
exports.renderLogin = (req, res) => {
  res.render("login");
};

exports.handleLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: newUser._id });
  } catch (err) {
    const error = handleErrors(err);
    res.status(400).json({ error });
  }
};

//logout
exports.logOut = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
