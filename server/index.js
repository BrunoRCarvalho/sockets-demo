require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

let pollResults = { a: 0, b: 0 };
let users = [];
let questions = [
  { id: 0, text: "True or False: I like Kahoots", a: 0, b: 0 },
  { id: 1, text: "True or False: I like Javascript", a: 0, b: 0 },
  { id: 2, text: "True or False: I like Assessments", a: 0, b: 0 }
];

let currentQuestion = 0;

io.on("connection", socket => {
  console.log("connected", questions[currentQuestion]);
  users.push(socket.id);
  io.emit("new user", users);
  //   socket.emit("new user", users);
  //   socket.broadcast.emit("new user", users);
  //   socket.emit("update votes", pollResults);
  io.emit("update votes", questions[currentQuestion]);

  socket.on("disconnect", reason => {
    console.log(reason);
    users = users.filter(user => user !== socket.id);
    console.log(users);
  });

  socket.on("vote", vote => {
    console.log(vote);
    questions[currentQuestion][vote]++;
    // socket.emit("update votes", pollResults);
    io.emit("update votes", questions[currentQuestion]);
  });
  socket.on("next question", () => {
    if (currentQuestion < questions.length - 1) {
      currentQuestion++;
    } else {
      currentQuestion = 0;
    }

    io.emit("update votes", questions[currentQuestion]);
  });
});

http.listen(5000, () => {
  console.log(`listening on 5000`);
});
