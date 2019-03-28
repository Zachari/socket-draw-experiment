const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3000;
let uri;
const prodUri = `https://socket-draw.now.sh`;
const testUri = `http://localhost`;
// const target = "";
const target = "prod";

if (target === "prod") uri = prodUri;
else uri = testUri;

app.use(express.static(__dirname + `/public`));

const state = {
  data: [],
  userCount: 0,
  toClear: false
};
let users = new Map();
const onConnection = socket => {
  users.set(socket.id, "active");
  let a = Array.from(users);
  state.userCount = a.length;

  io.emit("state_update", state);

  socket.on("drawing", data => {
    let s = state;
    s.data.push(data);
    s.userCount = state.userCount;
    io.emit("drawing", s.data);
    io.emit("state_update", s);
  });

  socket.on("clear_canvas", () => {
    state.data = [];
    state.toClear = true;
    io.emit("state_update", state);
    state.toClear = false;
  });

  socket.on("disconnect", reason => {
      console.log(`User (socket ID: ${socket.id}) disconnected (Reason: ${reason})`)
    users.delete(socket.id);
    let a = Array.from(users);
    state.userCount = a.length;
    if (state.userCount < 0) state.userCount = 0;
    io.emit("state_update", state);
  });
};

io.on("connection", onConnection);

http.listen(port, () => console.log(`Listening at ${uri}:${port}`));
