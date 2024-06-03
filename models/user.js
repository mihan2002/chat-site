// userModel.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { isEmail } = require("validator");
const Schema = mongoose.Schema;
require("dotenv").config();

// Create a separate connection for the users database
const userDbConnection = mongoose.createConnection(process.env.USERS_DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the user schema
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minLength: [6, "Minimum password length is 6 characters"],
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: [true, "Email already in use"],
    validate: [isEmail, "Please enter a valid email."],
    trim: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//static method to log in a user
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });

  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect email");
};

// Create the user model from the schema using the userDbConnection
const User = userDbConnection.model("User", userSchema);

module.exports = User;
