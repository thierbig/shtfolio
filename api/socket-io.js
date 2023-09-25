// utils/socket-io

// https://stackoverflow.com/questions/54818909/access-socketio-from-another-file

let io;
exports.socketConnection = (server) => {
  io = require("socket.io")(server, { path: "/api/v1/socketio/",transports: ['polling']});
  // io = require('socket.io')(server);
  io.on("connection", (socket) => {
    console.info(`Client connected [id=${socket.id}]`);
    // socket.join(socket.request._query.id);
    socket.on("disconnect", () => {
      console.info(`Client disconnected [id=${socket.id}]`);
    });
  });
};

exports.emitMessage = (eventName, eventValue) => io.emit(eventName, eventValue);

exports.sendMessage = (roomId, message) => io.to(roomId).emit(message);

exports.getRooms = () => io.sockets.adapter.rooms;
