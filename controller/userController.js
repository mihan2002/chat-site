const GetMessageModel = require("../models/message");
const User = require("../models/user");

//main page
exports.renderMainPage = async (req, res) => {
  res.render("main");
};

// public chat
exports.renderPublicChat = async (req, res) => {
  res.render("publicChat");
};

//private chat

exports.renderPrivateChat = async (req, res) => {
  res.render("privateChat");
};
exports.handlePrivateChat = async (req, res) => {
  const { room } = req.body;

  try {
    const messages = await GetMessageModel(room).find({});
    if (messages.length != 0) {
      res.status(200).json({ messages });
    }
    res.status(500);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
