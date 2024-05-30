require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./models/user");
const Message = require("./models/testmsg");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Set EJS as templating engine
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Could not connect to MongoDB", err);
  });

// Socket.IO connection
io.on("connection", (socket) => {
  socket.on("login", (username) => {
    socket.username = username;
    console.log(`${username} has logged in`);
  });

  socket.on("disconnect", () => {
    console.log(`${socket.username} disconnected`);
  });

  socket.on("chat message", async (msg) => {
    const message = new Message({
      sender: socket.username,
      message: msg,
    });

    try {
      await message.save();
      console.log("Message saved:", message);
    } catch (error) {
      console.error("Error saving message:", error);
    }

    io.emit("chat message", { username: socket.username, message: msg });
  });
});

// Routes
app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.password !== password) {
    return res.send("Invalid username or password");
  }

  // Instead of redirecting with a GET request, render the chat page directly
  res.render('publicChat', { username: user.username });
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { username, password, email } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).send("Email already in use");
  }

  try {
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.redirect("/login");
  } catch (err) {
    console.error("Error saving user to database:", err);
    res.status(500).send("Error saving user to database");
  }
});

// Server listen
server.listen(3000, () => {
  console.log("Listening on *:3000");
});
