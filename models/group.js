// groupModel.js
const mongoose = require("mongoose");
const { Schema } = mongoose;
const uniqueValidator = require("mongoose-unique-validator");
require("dotenv").config();

const groupDbConnection = mongoose.createConnection(process.env.Groups_DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the group schema
const groupSchema = new Schema({
  admin: {
    type: String,
    required: true,
  },
  groupName: {
    type: String,
    required: true,
  },
  members: {
    type: [String],
    default: [],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Apply the uniqueValidator plugin to groupSchema
groupSchema.plugin(uniqueValidator);

// Create the Group model
const Group = groupDbConnection.model("Group", groupSchema);

module.exports = Group;
