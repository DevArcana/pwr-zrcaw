const httpServer = require("http").createServer();

const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.use((socket, next) => {
  const username = socket.handshake.auth.username;

  if (!username) {
    return next(new Error("invalid username"));
  }

  socket.username = username;

  next();
});

io.on("connection", (socket) => {

});

io.on("disconnect", (socket) => {

});

httpServer.listen(3001, () => {
  console.log("listening");
});