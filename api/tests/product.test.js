const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const Event = require('../models/eventModel');

// A function to drop the test database after all tests are done
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('POST /api/v1/event/create', () => {
  it('should create an event', async () => {
    // Define the event data to send in the request body
    const eventData = {
      eventName: 'Test Event',
      eventDescription: 'Test Description',
      eventDateBegin: new Date(),
      eventDateEnd: new Date(),
    };

    // Make the request to create the event
    const res = await request(app).post('/api/v1/event/create').send(eventData);

    // Assert the response
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.insertResult).toBeDefined();

    // Check if the event has been saved in the database using the Event model
    const savedEvent = await Event.findOne({ name: 'Test Event' });
    expect(savedEvent).toBeDefined();
    expect(savedEvent.name).toBe('Test Event');
    expect(savedEvent.description).toBe('Test Description');
  });
});

describe('GET /api/v1/events', () => {
  it('should return all events', async (done) => {
    // Add some test events to the database
    const testEvents = [
      {
        name: 'Event 1',
        description: 'Description 1',
        dateBegin: new Date(),
        dateEnd: new Date(),
      },
      {
        name: 'Event 2',
        description: 'Description 2',
        dateBegin: new Date(),
        dateEnd: new Date(),
      },
    ];

    await Event.create(testEvents);

    // Make the request to get all events
    const res = await request(app).get('/api/v1/events');

    // Assert the response
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    // Check if all items in the array are of the same type (e.g., object)
    res.body.forEach((item) => {
      expect(typeof item).toBe('object');
    });

    // Check if the length of the response array matches the number of test events added
    expect(res.body.length).toBe(testEvents.length);

    // Check if the response body contains the test events' names
    testEvents.forEach((testEvent) => {
      const foundEvent = res.body.find((item) => item.name === testEvent.name);
      expect(foundEvent).toBeDefined();
    });

    // Call the done function to signal the completion of the asynchronous test
    done();
  });
});
