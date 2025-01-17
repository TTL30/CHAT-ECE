import React, { Component } from "react";
import io from "socket.io-client";
import Home from "./Components/Home/home"
const socket = io.connect("http://localhost:5000");

class App extends Component {
  constructor() {
    super();
    this.state = { msg: "", chat: [], nickname: "" };
  }

  componentDidMount() {
    socket.on("chat message", ({ nickname, msg }) => {
      this.setState({
        chat: [...this.state.chat, { nickname, msg }]
      });
    });
  }

  onTextChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };


  onMessageSubmit = () => {
    const { nickname, msg } = this.state;
    socket.emit("chat message", { nickname, msg });
    this.setState({ msg: "" });
  };
  onRoom = () => {
    socket.emit('room', "abc123");
  };

  renderChat() {
    const { chat } = this.state;
    return chat.map(({ nickname, msg }, idx) => (
      <div key={idx}>
        <span style={{ color: "green" }}>{nickname}: </span>

        <span>{msg}</span>
      </div>
    ));
  }

  render() {
    return (
      <div>
        {/* <span>Nickname</span>
        <input
          name="nickname"
          onChange={e => this.onTextChange(e)}
          value={this.state.nickname}
        />
        <span>Message</span>
        <input
          name="msg"
          onChange={e => this.onTextChange(e)}
          value={this.state.msg}
        />
        <button onClick={this.onMessageSubmit}>Send</button>
        <button onClick={this.onRoom}>Room</button>
        <div>{this.renderChat()}</div> */}



      </div>
    );
  }
}

export default App;
