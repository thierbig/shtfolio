const chatModel = require("../models/chatModel");
let emitMessage;
if (process.env.NODE_ENV != "production") {
  const { emitMessage: em } = require("../socket-io");
  emitMessage = em;
} else {
  const { emitMessage: em } = require("../socket-io-prod");
  emitMessage = em;
}

const postNewMessage = async (req, res, next) => {
  try {
    const { signature, message } = req.body;
    if (!signature) {
      throw new Error("invalid signature");
    } else if (!message || message.length > 250) {
      throw new Error("invalid message");
    }
    const doc = {
      username: signature,
      body: message,
      createdAt: Date.now(),
    };
    emitMessage("new_message", doc);
    const messageDoc = await chatModel.createNewMessage(signature, message);
    if (!messageDoc) {
      throw new Error("error while sending message");
    }
    return res.json({ success: true });
  } catch (err) {
    return res.json({ success: false, data: { error: err.message } });
  }
};

const getMessages = async (req, res, next) => {
  try {
    const messages = await chatModel.getMessages();
    return res.json(messages);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  postNewMessage,
  getMessages,
};
