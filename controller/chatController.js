const PublicChatMessageModel = require("../models/testmsg");
const getMessageModel = require("../models/message");

exports.setupSocketIO = (io) => {
  io.on("connection", (socket) => {
    socket.on("login", (username) => {
      socket.username = username;
      console.log(`${username} has logged in`);
    });

    socket.on("disconnect", () => {
      console.log(`${socket.username} disconnected`);
    });

    socket.on("public-chat", async (msg) => {
      try {
        const publicMessages = new PublicChatMessageModel({
          sender: msg.username,
          message: msg.message,
        });
        await publicMessages.save();

        io.emit("public-chat", {
          username: msg.username,
          message: msg.message,
        });
      } catch (error) {
        console.error("Error handling chat message:", error);
      }
    });

    socket.on("private-message", async (data) => {
      const { room, username, message } = data;
      const sender = username;
      const Message = getMessageModel(recipient);

      // Create a new message document
      const newMessage = new Message({
        sender,
        message,
      });
      try {
        await newMessage.save();
        console.log("Private message saved:", newMessage);
        io.to(room).emit("private message", {
          sender: socket.username,
          message,
        });
      } catch (error) {
        console.error("Error saving private message:", error);
      }
    });

    socket.on("join-room", (room) => {
      socket.join(room);
      console.log(`${socket.username} joined room ${room}`);
    });
  });
};
