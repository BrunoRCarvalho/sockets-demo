require("dotenv").config();
const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
let db;

app.get("/", (req, res) => {
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

http.listen(3001, () => {
  console.log("listening on 3000");
});
