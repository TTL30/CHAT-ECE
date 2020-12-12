import React, { useState, useEffect, useContext } from "react";
import { socket } from '../../../../../utils/socket';
import { useCookies } from "react-cookie";
import styles from './messagesStyle.module.css';
import { RoomContext } from "../../../../../Context/RoomContext";
import { deleteMessageChannel, getMessagesChannel } from "../../../../../utils/api_messages";
import { Button, Modal, Form, Container, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { addUsToChan } from "../../../../../utils/api_users";
import { ImBin } from 'react-icons/im';
import Gravatar from 'react-gravatar'

const Messages = () => {
  const [cookies, setCookie] = useCookies(["user"]);
  const { room, setRoom } = useContext(RoomContext);
  const [chat, setChat] = useState([]);

  //Modals
  const handleClose = () => (setShow(false), setErrors(false));
  const handleShow = () => setShow(true);
  const [show, setShow] = useState(false);
  const [add, setAdd] = useState(true);

  const { register, handleSubmit, errors } = useForm();
  const [myerrors, setErrors] = useState('');
  const [mySuccess, setSuccess] = useState('');


  const getMessages = () => {
    if (room) {
      getMessagesChannel(room.id, (onSucessMessage) => {
        if (room.id_cre === cookies.user.id) setAdd(false);
        else setAdd(true);
        setChat(onSucessMessage);
        socket.emit('join', { username: cookies.user.username, room: room.id, type:0, email:cookies.user.email }, (error) => {
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
  const getdate = (date) =>{
    var dt = new Date(date/1000);
    return(dt.toLocaleString())
  }

  const delMessageHide = (data) =>{
    if(data === cookies.user.username){
      return false
    }else{
      return true
    }
  }

  useEffect(() => {
    socket.on('delete', msg => {
      if(msg){
        document.getElementById(msg.message).hidden=true
      }
    });
  }, []);

  const deleteMessage = (data) => {
    console.log("je veux delete client " + data.target.value)
    deleteMessageChannel(data.target.value, room.id,
      (onSucessMessage) => {
        console.log(onSucessMessage);
        document.getElementById(data.target.value).hidden=true
        socket.emit('delete message', { room:room.id,message: data.target.value}, (error) => {
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

  const bot = (author, date) =>{
    if(author == 'ECE-BOT'){
      return(<span style={{ color: "#7289da" }}>{author} <i style={{color: "gray", fontSize:'10px'}}>{getdate(date)}</i> </span>)
    }else{
      return(<span style={{ color: "white" }}><b style={{fontSize:"1.2em"}}>{author}</b> <i style={{color: "grey", fontSize:'10px'}}>{getdate(date)}</i> </span>)
    }
  }
  const pic = (email) =>{
    if(email == 'bot'){
      return(  <Gravatar email={email}  rating="pg" default="robohash" className="CustomAvatar-image" style={{ borderRadius:"50%"}}/>)
    }else{
      return(  <Gravatar email={email}  rating="pg" default="monsterid" className="CustomAvatar-image" style={{ borderRadius:"50%"}}/>)
    }
  }
  let listChat = chat.map((d, index) =>
    <div id={d.creation}  className={styles.msgr} >
      <Container >
        <Row >
          <Col className={styles.ico} xs lg="1">
            {pic(d.email)}
          </Col>
          <Col sm={8}>
          {bot(d.author, d.creation)}
            <p style={{color: "white"}}>
            {d.content}
            </p>
          </Col>
          <Col sm={2}>
          <Button hidden={delMessageHide(d.author)} value={d.creation} onClick={e => deleteMessage(e)}>
{/*             <ImBin />
 */} del         
 </Button>
          </Col>

        </Row>
      </Container>
    </div>
  )

  const addUserToChannel = (data) => {
    addUsToChan(room.id, data.username,
      (onSucessMessage) => {
        setErrors('');
        setSuccess(onSucessMessage);
      },
      (onErrorMessage) => {
        setErrors(onErrorMessage);
      });
  }


  return (
    <div className={styles.wrapper}>
      <div className={styles.msg}>
        {listChat}
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add a user </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(addUserToChannel)} >
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Name : </Form.Label>
              <Form.Control type="text" name="username" ref={register({ required: true, maxLength: 50 })} />
              {errors.username && errors.username.type === "required" && <p className={styles.error}> <span>&#9888;</span> Merci de bien renseigner ce champ</p>}

            </Form.Group>
            <Button variant="secondary" onClick={handleClose}>
              Close
                    </Button>
            <Button variant="outline-success" type="submit">
              Submit
                    </Button>
            {myerrors &&
              <div className="alert alert-danger mt-3" role="alert">
                {myerrors}
              </div>
            }
            {mySuccess &&
              <div className="alert alert-success mt-3" role="alert">
                {mySuccess}
              </div>
            }
          </Form>
        </Modal.Body>
      </Modal>


    </div>
  );
}

export default Messages;