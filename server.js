require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const userRoutes = require('./routes/userRoutes');
const chatController = require('./controller/chatController');

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

// Use routes
app.use('/', userRoutes);

// Setup Socket.IO
chatController.setupSocketIO(io);

// Server listen
server.listen(3000, () => {
  console.log("Listening on *:3000");
});
