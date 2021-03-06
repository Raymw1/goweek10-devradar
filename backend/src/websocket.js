const parseStringAsArray = require("./app/utils/parseStringAsArray");
const calculateDistance = require("./app/utils/calculateDistance");
const connections = [];

let io;
exports.setupWebSocket = (server) => {
  io = require("socket.io")(server);
  io.on("connection", (socket) => {
    const { latitude, longitude, techs } = socket.handshake.query;
    connections.push({
      id: socket.id,
      coordinates: { latitude: Number(latitude), longitude: Number(longitude) },
      techs: parseStringAsArray(techs),
    });
  });
};

exports.findConnections = (coordinates, techs) => {
  return connections.filter((connection) => {
    return (
      calculateDistance(coordinates, connection.coordinates) < 10 &&
      connection.techs.some((tech) => techs.includes(tech))
    );
  });
};

exports.sendMessage = (to, message, data) => {
  to.forEach((connection) => {
    io.to(connection.id).emit(message, data);
  });
};
