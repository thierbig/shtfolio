const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
      },
  body: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
