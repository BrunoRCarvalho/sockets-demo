import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import openSocket from "socket.io-client";
const socket = openSocket();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { a: 1, b: 1, users: [] };
    socket.on("update votes", ({ a, b }) => {
      this.setState({ a, b });
    });
    socket.on("new user", users => this.setState({ users }));
  }
  vote(choice) {
    socket.emit("vote", choice);
  }
  render() {
    const { a, b } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <h1>{this.state.users.length}</h1>
        <button onClick={() => this.vote("a")}>a</button>
        <button onClick={() => this.vote("b")}>b</button>
        <p>
          {this.state.a} A - {this.state.b} B
        </p>
        <div
          style={{
            width: "60%"
          }}
        >
          <div
            style={{
              width: `${a / (a + b) * 100}%`,
              height: "100px",
              background: "blue",
              transition: "all 500ms ease-in-out"
            }}
          />
          <div
            style={{
              width: `${b / (a + b) * 100}%`,
              transition: "all 500ms ease-in-out",
              height: "100px",
              background: "red"
            }}
          />
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
