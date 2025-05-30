// messageModel.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageDbConnection = mongoose.createConnection(
  process.env.Public_Chat_DB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
// Define the message schema
const messageSchema = new Schema({
  sender: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Function to create a model for a specific user's messages
const PublicChatMessageModel = messageDbConnection.model(`group_messages`, messageSchema);

module.exports = PublicChatMessageModel;
