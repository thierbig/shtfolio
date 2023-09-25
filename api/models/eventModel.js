const mongoose = require('mongoose');
const Counter = require('./counterModel');

const eventSchema = new mongoose.Schema({
  eventId: { type: Number, unique: true },
  name: { type: String, maxLength: 32, required: true },
  description: { type: String, required: true },
  dateBegin: { type: Date, required: true },
  dateEnd: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

eventSchema.pre('save', async function (next) {
  try {
    if (!this.isNew || this.eventId) {
      // If the document is not new or already has an eventId, proceed to the next middleware
      return next();
    }

    // Use findOneAndUpdate to atomically increment the counter and get the updated value
    const counter = await Counter.findOneAndUpdate(
      { _id: 'eventIdCounter' },
      { $inc: { seq: 1 } },
      { upsert: true, new: true, useFindAndModify: false }
    );

    this.eventId = counter.seq;
    next();
  } catch (error) {
    return next(error);
  }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;