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

    socket.on("private", async (data) => {
      const { room, username, message } = data;
      console.log(data);
      const PrivetMessage = await getMessageModel(room);
      const privetChatMessage = new PrivetMessage({
        sender: username,
        message: message,
      });

      await privetChatMessage.save();
      try {
        io.to(room).emit("private", {
          sender: socket.username,
          message: message,
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
