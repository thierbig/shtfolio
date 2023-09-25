const Event = require('../models/eventModel');

async function createEvent(req, res) {
  try {
    const { eventName, eventDescription, eventDateBegin, eventDateEnd } = req.body;

    // Validate eventeventName length
    if (eventName.length > 32) {
      return res.json({
        success: false,
        data: { error: "eventName has a 32 characters maximum limit" },
      });
    }

    // Validate eventDateBegin and eventDateEnd are valid date strings
    if (!isValidDate(eventDateBegin) || !isValidDate(eventDateEnd)) {
      return res.json({
        success: false,
        data: {
          error: "eventDateBegin and eventDateEnd must be valid date strings.",
        },
      });
    }

    const newEvent = await Event.create({
      name:eventName,
      description:eventDescription,
      dateBegin:eventDateBegin,
      dateEnd:eventDateEnd,
    });

    return res.json({ success: true, data: { newEvent } });
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      data: { error: "Generic error message..." },
    });
  }
}

async function getEvents(req, res) {
  try {
    const events = await Event.find();
    return res.json({ success: true, data: { events } });
  } catch (err) {
    console.error(err);
    return res.json({
      success: false,
      data: { error: 'Generic error message...' },
    });
  }
}


// Helper function to validate date string
function isValidDate(dateString) {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}

module.exports = { createEvent,getEvents };