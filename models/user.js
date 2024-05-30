// userModel.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("dotenv").config();

// Create a separate connection for the users database
const userDbConnection = mongoose
  .createConnection(process.env.USERS_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

// Define the user schema
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Create the user model from the schema using the userDbConnection
const User = userDbConnection.model("User", userSchema);

module.exports = User;
