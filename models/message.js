const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageDbConnection = mongoose.createConnection(process.env.MSG_DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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
const getMessageModel = (roomID) => {
  return messageDbConnection.model(`${roomID}`, messageSchema);
};

module.exports = getMessageModel;
