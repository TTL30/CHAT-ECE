import React, { useState, useEffect, useContext } from "react";
import { socket } from '../../../../../utils/socket';
import { useCookies } from "react-cookie";
import styles from './messagesStyle.module.css';
import { RoomContext } from "../../../../../Context/RoomContext";
import { deleteMessageChannel, getMessagesChannel, upMessageChannel } from "../../../../../utils/api_messages";
import { Button, Container, Row, Col, InputGroup, FormControl } from "react-bootstrap";
import Gravatar from 'react-gravatar'
import { BsPencil } from 'react-icons/bs'

const Messages = () => {

  const [cookies, setCookie] = useCookies(["user"]);
  const { room, setRoom } = useContext(RoomContext);
  const [chat, setChat] = useState([]);
  const [msgChange, setMsgChange] = useState('')
  const [msgChangeID, setIDMsgChange] = useState('');

  const getMessages = () => {
    if (room) {
      getMessagesChannel(room.id, (onSucessMessage) => {
        setChat(onSucessMessage);
        socket.emit('check socket', { username: cookies.user.username, room: room.id, email: cookies.user.email, avatar: cookies.user.avatar }, (error) => {
          if (error) {
            alert(error);
          }
        });
      }, (onErrorMessage) => {
        console.log(onErrorMessage);
      });
    } else {
      console.log("no room")
    }
  }

  useEffect(() => {
    getMessages();
  }, [room]);

  useEffect(() => {
    socket.on('message', msg => {
      setChat(chat => [...chat, msg]);
    });

  }, []);

  useEffect(() => {
    socket.on('room del', () => {
      localStorage.setItem('room', null)
      alert("Room has been delete you will be redirect to home")
      window.location.reload()
    });
  }, []);
  const getdate = (date) => {
    const dt = new Date(parseInt(date));
    return (dt.toLocaleString())
  }

  const delMessageHide = (data) => {
    if (data === cookies.user.username) {
      return false
    } else {
      return true
    }
  }

  useEffect(() => {
    socket.on('delete', msg => {
      if (msg.message) {
        document.getElementById(msg.message).hidden = true
      }
    });
    socket.on('update', msg => {
      if (msg.message) {
        document.getElementById("p" + msg.message).innerHTML = msg.content
      }
    });
  }, []);

  const deleteMessage = (data) => {
    if (data.target.value) {
      deleteMessageChannel(data.target.value, room.id,
        (onSucessMessage) => {
          console.log(onSucessMessage);
          document.getElementById(data.target.value).hidden = true
          socket.emit('delete message', { room: room.id, message: data.target.value }, (error) => {
            if (error) {
              alert(error);
            }
          });
        },
        (onErrorMessage) => {
          console.log(onErrorMessage)
        }
      )
    }
  }



  const bot = (author, date) => {
    if (author === 'ECE-BOT') {
      return (<span style={{ color: "#7289da" }}>{author} <i style={{ color: "gray", fontSize: '10px' }}>{getdate(date)}</i> </span>)
    } else {
      return (<span style={{ color: "white" }}><b style={{ fontSize: "1.2em" }}>{author}</b> <i style={{ color: "grey", fontSize: '10px' }}>{getdate(date)}</i> </span>)
    }
  }
  const pic = (email, avatar) => {
    if (email === 'bot') {
      return (<Gravatar email={email} rating="pg" default="robohash" className="CustomAvatar-image" style={{ borderRadius: "50%" }} />)
    } else {
      return (<Gravatar email={email} rating="pg" default={avatar} className="CustomAvatar-image" style={{ borderRadius: "50%" }} />)
    }
  }
  const updateMessage = (data) => {
    if (data.target.value) {
      document.getElementById("p" + data.target.value).hidden = true
      document.getElementById("i" + data.target.value).hidden = false
      setIDMsgChange(data.target.value)
      setMsgChange(document.getElementById("p" + data.target.value).innerText)
    }

  }

  const onChange = (e) => {
    setMsgChange(msgChange)
  }
  const updateTheMessage = (event) => {
    event.preventDefault();
    upMessageChannel(msgChangeID, room.id, event.target.value,
      (onSucessMessage) => {
        console.log(onSucessMessage)
        document.getElementById("i" + msgChangeID).hidden = true
        document.getElementById("p" + msgChangeID).hidden = false
        document.getElementById("p" + msgChangeID).innerText = event.target.value
        socket.emit('update message', { room: room.id, message: msgChangeID, content: event.target.value }, (error) => {
          if (error) {
            alert(error);
          }
        });

      }, (onErrorMessage) => {
        console.log(onErrorMessage)
      })
  }

  let listChat = chat.map((d, index) =>
    <div id={d.creation} className={styles.msgr} >
      <Container >
        <Row >
          <Col className={styles.ico} xs lg="1">
            {pic(d.email, d.avatar)}
          </Col>
          <Col sm={9}>
            {bot(d.author, d.creation)}
            <p id={"p" + d.creation} style={{ color: "white" }}>
              {d.content}
            </p>
            <InputGroup>
              <FormControl id={"i" + d.creation} as="input" aria-label="With textarea" defaultValue={d.content} onChange={e => onChange(e)} hidden onKeyPress={event => event.key === 'Enter' ? updateTheMessage(event) : null} />
            </InputGroup>
          </Col>
          <Col sm={1} style={{ margin: "auto" }} >
            <Button variant="outline-danger" hidden={delMessageHide(d.author)} value={d.creation} onClick={e => deleteMessage(e)}>
              x
          </Button>
          </Col>
          <Col sm={1} style={{ margin: "auto" }} >

            <Button variant="outline-warning" hidden={delMessageHide(d.author)} value={d.creation} onClick={e => updateMessage(e)}>
              <BsPencil />
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  )


  return (
    <div className={styles.wrapper}>
      <div className={styles.msg}>
        {listChat}
      </div>
    </div>
  );
}

export default Messages;