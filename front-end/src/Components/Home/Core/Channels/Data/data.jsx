import React, { useContext, useState } from 'react';
import { Button, Form, Modal, Dropdown, Row, Col, Jumbotron, Container } from 'react-bootstrap';
import styles from './dataStyle.module.css'
import { Cookies, useCookies } from "react-cookie";
import { FiSettings } from 'react-icons/fi';
import Gravatar from 'react-gravatar'
import { changeAvat } from '../../../../../utils/api_users';
import { RoomContext } from '../../../../../Context/RoomContext';
import { socket } from '../../../../../utils/socket';

const Data = () => {

    const [cookies, setCookie] = useCookies(["user"]);
    const handleClose = () => (setShow(false), setShowavt(true));
    const handleShow = () => setShow(true);
    const { room, setRoom } = useContext(RoomContext);
    const [show, setShow] = useState(false);
    const [showAvat, setShowavt] = useState(true)
    const handleShowAv = () => setShowavt(false)
    const [avatar, setAvatar] = useState(cookies.user.avatar)
    const changeAvatar = (data) => {
        changeAvat(cookies.user.id, data,
            (onSucessMessage) => {
                setCookie('user', { id: cookies.user.id, username: cookies.user.username, email: cookies.user.email, channels: cookies.user.channels, avatar: data })
                setAvatar(data)
                socket.emit('check room', { username: cookies.user.username, room: room.id, avatar: data }, (error) => {
                    if (error) {
                        alert(error);
                    }
                });
            }, (onErrorMessage) => {
                console.log(onErrorMessage)
            })
    }


    return (
        <div className={styles.wrapper}>
            <div className={styles.data}>
                <Row>
                    <Col>
                        <Gravatar email={cookies.user.email} rating="pg" default={avatar} className="CustomAvatar-image" style={{ borderRadius: "50%" }} />
                    </Col>
                    <Col>
                        <span>{cookies.user.username}</span>
                    </Col>
                    <Col>
                        <FiSettings onClick={handleShow} style={{ cursor: 'pointer' }} />

                    </Col>
                </Row>
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton className={styles.mod}>
                    <Modal.Title>Settings </Modal.Title>
                </Modal.Header>
                <Modal.Body className={styles.mod}>
                        <Form.Group controlId="formBasicUser">
                            <Form.Label>Username : </Form.Label>
                            <Form.Control disabled type="text" name="name" value={cookies.user.username} />
                        </Form.Group>
                        <Form.Group controlId="formBasicUser">
                            <Form.Label>Email : </Form.Label>
                            <Form.Control disabled type="text" name="name" value={cookies.user.email} />
                        </Form.Group>
                            <div id="avatar" hidden>
                                hello
                            </div>

                            <Button variant="outline-success" onClick={handleShowAv}>
                                edit avatar
                            </Button>
                            <Row id={"showAvat"} className={styles.jumb} hidden={showAvat}>
                                <Col sm={4} style={{ margin: "auto" }}>
                                    <div onClick={e => changeAvatar("identicon")} className={styles.ico}>
                                        <Gravatar email={cookies.user.email} size={75} rating="pg" default="identicon" className="CustomAvatar-image" style={{ borderRadius: "50%" }} />
                                    </div>
                                </Col>
                                <Col sm={4} style={{ margin: "auto" }}>
                                    <div onClick={e => changeAvatar("monsterid")} className={styles.ico}>
                                        <Gravatar email={cookies.user.email} size={75} rating="pg" default="monsterid" className="CustomAvatar-image" style={{ borderRadius: "50%" }} />
                                    </div>
                                </Col>
                                <Col sm={4} style={{ margin: "auto" }}>
                                    <div onClick={e => changeAvatar("wavatar")} className={styles.ico}>
                                        <Gravatar email={cookies.user.email} size={75} rating="pg" default="wavatar" className="CustomAvatar-image" style={{ borderRadius: "50%" }} />
                                    </div>
                                </Col>
                                <Col sm={4} style={{ margin: "auto" }}>
                                    <div onClick={e => changeAvatar("retro")} className={styles.ico}>

                                        <Gravatar email={cookies.user.email} size={75} rating="pg" default="retro" className="CustomAvatar-image" style={{ borderRadius: "50%" }} />
                                    </div>
                                </Col>
                                <Col sm={4} style={{ margin: "auto" }}>
                                    <div onClick={e => changeAvatar("robohash")} className={styles.ico}>

                                        <Gravatar email={cookies.user.email} size={75} rating="pg" default="robohash" className="CustomAvatar-image" style={{ borderRadius: "50%" }} />
                                    </div>

                                </Col>
                                <Col sm={4} style={{ margin: "auto" }}>
                                    <div onClick={e => changeAvatar("mp")} className={styles.ico}>
                                        <Gravatar email={cookies.user.email} size={75} rating="pg" default="mp" className="CustomAvatar-image" style={{ borderRadius: "50%" }} />
                                    </div>
                                </Col>
                            </Row>

                        <Button variant="secondary" onClick={handleClose}>
                            Close
                    </Button>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default Data;