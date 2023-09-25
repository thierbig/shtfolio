const mongoose = require('mongoose');
const Message = require('./messageModel')

const User = mongoose.model('User'); // Assuming you have a User model


//TODO: add signature and verify user
const createNewMessage = async (email, message) => {
  const now = Date.now();
  const user = await User.findOneAndUpdate(
    {
        email,
      //verified: true,
      //lastMessageAt: { $lte: now - 2000 },
    },
    {
      $set: {
        lastMessageAt: now,
      },
    },
    {
      new: true,
    }
  );

 // if (!user || !user.verified) {
    //return null;
  //}

  const messageDoc = new Message({
    user: user.email,
    body: message,
    createdAt: now,
  });

  await messageDoc.save();
  return messageDoc;
};

const getMessages = async () => {
  const messages = await Message.find()
    .sort({ _id: -1 })
    .limit(200)
    .exec();
  return messages;
};

module.exports = {
  createNewMessage,
  getMessages
};
