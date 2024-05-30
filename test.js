const mongoose = require("mongoose");
const Group = require('./models/group'); // Make sure this path is correct

require('dotenv').config();

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Connected to MongoDB");

    try {
      const newGroup = new Group({ admin: "adminUsername",groupName:"abc" });
      await newGroup.save();
      console.log("New group created:", newGroup);
    } catch (error) {
      console.error("Error creating new group:", error);
    } finally {
      mongoose.connection.close();
    }
  })
  .catch((err) => {
    console.error("Could not connect to MongoDB", err);
  });
