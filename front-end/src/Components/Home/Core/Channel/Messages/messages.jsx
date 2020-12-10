import React, { useState, useEffect, useContext } from "react";
import queryString from 'query-string';

import { socket } from '../../../../../utils/socket'
import { useCookies } from "react-cookie";
import styles from './messagesStyle.module.css'
import { RoomContext } from "../../../../../Context/RoomContext";
import { getMessagesChannel } from "../../../../../utils/api_messages";
import { Button, Modal, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { addUsToChan } from "../../../../../utils/api_users";


const Messages = () => {
  const [cookies, setCookie] = useCookies(["user"]);
  const { room, setRoom } = useContext(RoomContext);
  const [chat, setChat] = useState([]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [show, setShow] = useState(false);
  const { register, handleSubmit, errors } = useForm();
  const [add, setAdd] = useState(true)
  const [myerrors, setErrors] = useState('');
  const [mySuccess, setSuccess] = useState('');


  const getMessages = () => {
    console.log("nnnnnnnnnno")
    if (room) {
      getMessagesChannel(room.id, (onSucessMessage) => {
        console.log(onSucessMessage)
        if (room.id_cre === cookies.user.id) setAdd(false)
        else setAdd(true)
        setChat(onSucessMessage);
      }, (onErrorMessage) => {
        console.log(onErrorMessage)
      })
    } else {
      console.log("no room")
    }
  }

  useEffect(() => {
    getMessages()
  }, [room]);

  useEffect(() => {
    console.log(chat)
    socket.on('message', msg => {
      setChat(chat => [...chat, msg]);
    });
  }, []);

  let listChat = chat.map((d, index) =>
    <div key={index} className={styles.msgr} >
      <span style={{ color: "green" }}>{d.author}: </span>
      <span>{d.content}</span>
    </div>
  ) 

  const addUserToChannel = (data) => {
    addUsToChan(room.id, data.username,
      (onSucessMessage) => {
        console.log(onSucessMessage)
        setErrors('')
        setSuccess(onSucessMessage)
      },
      (onErrorMessage) => {
        console.log(onErrorMessage)
        setErrors(onErrorMessage)
      })
  }


  return (
    <div className={styles.wrapper}>
      <div className={styles.msg}>
      {listChat}
    </div>
      <Button hidden={add} onClick={handleShow}>
        <h3>+</h3>
      </Button>

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