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

  try {
    const messages = await GetMessageModel(room).find({});
    res.status(200).json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
