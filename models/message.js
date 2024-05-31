const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageDbConnection = mongoose.createConnection(process.env.USERS_DB_URI, {
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
const getMessageModel = (userId1, userId2) => {
  // Sort user IDs to ensure consistent collection names
  const sortedIds = [userId1, userId2].sort().join('_');
  return messageDbConnection.model(`${sortedIds}`, messageSchema);
};

module.exports = getMessageModel;
