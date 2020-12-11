import React, { useState, useEffect, useContext } from "react";
import { socket } from '../../../../../utils/socket';
import { useCookies } from "react-cookie";
import styles from './messagesStyle.module.css';
import { RoomContext } from "../../../../../Context/RoomContext";
import { getMessagesChannel } from "../../../../../utils/api_messages";
import { Button, Modal, Form, Container, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { addUsToChan } from "../../../../../utils/api_users";
import { FaUserAlt } from 'react-icons/fa';
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
  let listChat = chat.map((d, index) =>
    <div key={index} className={styles.msgr} >
      <Container>
        <Row>
          <Col className={styles.ico} xs lg="1">
            <h3> <FaUserAlt /> </h3> 
          </Col>
          <Col md="auto">
          <span style={{ color: "white" }}>{d.author} <i style={{color: "gray", fontSize:'10px'}}>{getdate(d.creation)}</i> </span>
            <p style={{color: "white"}}>
            {d.content}
            </p>
          </Col>
          <Col xs lg="1"  >
          <Button >
            Delete
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