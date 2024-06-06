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
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  request: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
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
//static method to send a friend request
userSchema.statics.sendFriendRequest = async function (myId, friendId) {
  try {
    const friend = await this.findById(friendId);
    if (!friend) {
      throw new Error("Friend not found");
    }
    // Check if the friend request already exists
    if (friend.request.includes(myId)) {
      throw new Error("Friend request already exists");
    }
    // Add the friend request
    friend.request.push(myId);
    //Save the friend document
    await friend.save();
    return friend;
  } catch (error) {
    throw new Error(error.message);
  }
};
//static method to accept user as a friend
userSchema.statics.acceptOrDeclineRequest = async function (
  myId,
  friendId,
  accept
) {
  try {
    const me = await this.findById(myId);
    const friend = await this.findById(friendId);
    if (!me) {
      throw new Error("User not found");
    }
    const requestIndex = me.request.indexOf(friendId);
    if (requestIndex === -1) {
      throw new Error("Friend request not found");
    }
    // Remove the request from the requests array
    me.request.splice(requestIndex, 1);
    // Add the friend to the friends array
    if (accept) {
      if (!me.friends.includes(friendId)) {
        console.log("friend");
        me.friends.push(friendId);
        friend.friends.push(myId);
      } else {
        throw new Error("User is already a friend");
      }
    }
    await me.save();
    await friend.save();
    return me;
  } catch (error) {
    throw new Error(error.message);
  }
};

userSchema.statics.getFriendRequests = async function (userId) {
  try {
    const user = await this.findById(userId).populate("request", "username");
    if (!user) {
      throw new Error("User not found");
    }
    // Return user data along with friend requests
    return {
      username: user.username,
      email: user.email,
      created_at: user.created_at,
      requests: user.request,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Create the user model from the schema using the userDbConnection
const User = userDbConnection.model("User", userSchema);

module.exports = User;
