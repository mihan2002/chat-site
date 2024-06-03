const Message = require('../models/testmsg');
const getMessageModel = require('../models/message');

exports.handleChatMessage = async (socket, msg) => {

  const message = new Message({
    sender: socket.username,
    message: msg,
  });

  try {
    await message.save();
    console.log("Message saved:", message);
    return message;
  } catch (error) {
    console.error("Error saving message:", error);
    throw error;
  }
};

exports.setupSocketIO = (io) => {
  io.on("connection", (socket) => {
    socket.on("login", (username) => {
      socket.username = username;
      console.log(`${username} has logged in`);
    });

    socket.on("disconnect", () => {
      console.log(`${socket.username} disconnected`);
    });

    socket.on("chat message", async (msg) => {
      try {
        const message = await exports.handleChatMessage(socket, msg);
        io.emit("chat message", { username: socket.username, message: msg });
      } catch (error) {
        console.error("Error handling chat message:", error);
      }
    });

    socket.on("private message", async (data) => {
      const { recipient,username, message } = data;
      const sender =username;
      const Message = getMessageModel(recipient);

      // Create a new message document
      const newMessage = new Message({
        sender,
        message,
      });
      try {
        await newMessage.save()
        console.log("Private message saved:", newMessage);
        io.to(recipient).emit("private message", { sender: socket.username, message });
      } catch (error) {
        console.error("Error saving private message:", error);
      }
    });

    socket.on("join room", (room) => {
      socket.join(room);
      console.log(`${socket.username} joined room ${room}`);
    });
  });
};
