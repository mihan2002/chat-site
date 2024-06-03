const User = require("../models/user");
const Msges = require("../models/testmsg");
const GetMessageModel = require("../models/message");

exports.renderMainPage = async (req, res) => {
  res.render("main");
};

exports.handlePublicChat = async (req, res) => {
  res.render("publicChat");
};

exports.renderPrivateChat = async (req, res) => {
  res.render("privateChat");
};
exports.handlePrivateChat = async (req, res) => {
  const { room } = req.body;
  const Message = await GetMessageModel(room).find({});
};
