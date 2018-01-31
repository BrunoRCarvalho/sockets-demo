require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
let db;

if (!process.env.PORT) {
  let use = `${__dirname}/../build`;
  console.log(use);
  app.use(express.static(use));
}
app.get("/api/", (req, res) => {
  res.send("<h1>Hello</h1>");
});

let pollResults = { a: 0, b: 0 };
let users = [];

io.on("connection", socket => {
  console.log("connected");
  users.push(socket.id);
  io.emit("new user", users);
  //   socket.emit("new user", users);
  //   socket.broadcast.emit("new user", users);
  //   socket.emit("update votes", pollResults);
  io.emit("update votes", pollResults);

  socket.on("disconnect", reason => {
    console.log(reason);
    users = users.filter(user => user !== socket.id);
    console.log(users);
  });

  socket.on("vote", vote => {
    pollResults[vote]++;
    console.log(vote, pollResults);
    // socket.emit("update votes", pollResults);
    io.emit("update votes", pollResults);
  });
});

http.listen(process.env.PORT || 80, () => {
  console.log(`listening on ${process.env.PORT || 80}`);
});
