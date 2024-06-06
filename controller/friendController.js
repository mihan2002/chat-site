const User = require("../models/user");

//search  chat page
exports.renderSearchPage = async (req, res) => {
  res.render("addFriend");
};
//handle search chat
exports.handleSearchChat = async (req, res) => {
  const { username } = req.body;
  try {
    const user = await User.find({ username });
    console.log(user);
    res.status(200).json({ user });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error });
  }
};

//send a friend request
exports.sendFriendReq = async (req, res) => {
  const { _id, userId } = req.body;
  console.log(_id);
  console.log(userId);
  try {
    const user = await User.sendFriendRequest(_id, userId);
    res.status(200).json({ user });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error });
  }
};
//render friend request page
exports.renderRequestPage = async (req, res) => {
  res.render("requestPage");
};
//accept the friend request
exports.acceptOrDeclineRequest = async (req, res) => {
  const { userId, requestId, accept } = req.body;
  console.log(req.body);
  try {
    if(accept){
      const user = await User.acceptOrDeclineRequest(userId,requestId,accept);
      res.status(200).json({ user });
    }else{
      const user = await User.acceptOrDeclineRequest(userId,requestId,accept);
      res.status(200).json({ user });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error });
  }
};
