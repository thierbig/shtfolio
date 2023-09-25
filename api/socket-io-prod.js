// utils/socket-io

// https://stackoverflow.com/questions/54818909/access-socketio-from-another-file
const axios = require("axios").default;

let io;
async function emitMessageSocket(eventName, eventValue) {
  try {
    const resp = await axios.post(
      "https://socket.shtfolio.xyz/api/emitMessageSocket",
      { data: { eventName, eventValue } }
    );
    return resp;
  } catch (err) {
    // Handle Error Here
    console.error(err);
  }
}

async function sendMessageSocket(roomId, message) {
  try {
    const resp = await axios.post(
      "https://socket.shtfolio.xyz/api/sendMessageSocket",
      { data: { roomId, message } }
    );
    return resp;
  } catch (err) {
    // Handle Error Here
    console.error(err);
  }
}

async function getRoomsSocket() {
  try {
    const resp = await axios.get(
      "https://socket.shtfolio.xyz/api/getRoomsSocket"
    );
    return resp;
  } catch (err) {
    // Handle Error Here
    console.error(err);
  }
}

exports.emitMessage = (eventName, eventValue) =>
  emitMessageSocket(eventName, eventValue);

exports.sendMessage = (roomId, message) => sendMessageSocket(roomId, message);

exports.getRooms = () => getRoomsSocket();
