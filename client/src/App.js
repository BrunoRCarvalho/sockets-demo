import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import openSocket from "socket.io-client";
// const socket = openSocket();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question: {
        id: 0,
        text: "",
        a: 0,
        b: 0
      },
      users: []
    };
    this.next = this.next.bind(this);
  }
  componentDidMount() {
    this.socket = openSocket();
    this.socket.on("new question", question => this.setState({ question }));
    this.socket.on("update votes", question => {
      this.setState({ question });
    });
    this.socket.on("new user", users => this.setState({ users }));
  }
  vote(choice) {
    this.socket.emit("vote", choice);
    this.setState({ voted: true });
  }
  next() {
    this.socket.emit("next question");
  }
  render() {
    const isAdmin = !!window.location.href.split("?")[1];
    const styles = {
      voteContainer: {
        display: "flex",
        fledDirection: "row",
        justifyContent: "space-around",
        alignItems: "flex-end",
        height: "300px",
        borderBottom: "1px solid black"
      },
      bar: {
        transition: "all 500ms ease-in-out",
        width: "100px",
        borderTopLeftRadius: "8px",
        borderTopRightRadius: "8px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        color: "#000000"
      }
    };
    console.log(this.state);
    console.log(isAdmin);
    const { a, b } = this.state.question;
    const aPercent = Math.floor(a / (a + b) * 100) || 0;
    const bPercent = Math.floor(b / (a + b) * 100) || 0;

    return (
      <div className="App">
        <p>{this.state.question.text}</p>
        <button onClick={() => this.vote("a")}>True</button>
        <button onClick={() => this.vote("b")}>False</button>

        <p>
          {a} A - {b} B
        </p>

        <div style={styles.voteContainer}>
          <div
            style={{
              ...styles.bar,
              height: `${aPercent}%`,
              background: "#E44424"
            }}
          >
            <p>True</p>
            <p>{aPercent}%</p>
            <p>{a} votes</p>
          </div>
          <div
            style={{
              ...styles.bar,
              height: `${bPercent}%`,
              background: "#A2AB58"
            }}
          >
            <p>False</p>
            <p>{bPercent}%</p>
            <p>{b} votes</p>
          </div>
        </div>
        <h1>{this.state.users.length}</h1>
        <h3>{this.state.users.length === 1 ? "user" : "users"} online</h3>
        {isAdmin && <button onClick={this.next}>Next Question</button>}
      </div>
    );
  }
}

export default App;
