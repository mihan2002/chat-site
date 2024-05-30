const User = require('../models/user');
const Msges = require('../models/testmsg');

exports.renderMainPage = (req, res) => {
    res.render('main');
  };
  
exports.renderLogin = (req, res) => {
  res.render('login');
};

exports.handleLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  const msgs = await Msges.find({});
  if (!user || user.password !== password) {
    return res.send("Invalid username or password");
  }
  res.render('publicChat', { username: user.username ,chatHistory:msgs});
};

exports.renderRegister = (req, res) => {
  res.render('register');
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
    res.redirect('/login');
  } catch (err) {
    console.error("Error saving user to database:", err);
    res.status(500).send("Error saving user to database");
  }
};
