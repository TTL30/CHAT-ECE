import React, { useContext, useState } from 'react';
import { Button, Form, Modal, Dropdown, Row, Col, Jumbotron, Container } from 'react-bootstrap';
import styles from './avatarStyle.module.css'
import { Cookies, useCookies } from "react-cookie";
import { FiSettings } from 'react-icons/fi';
import Gravatar from 'react-gravatar'
import { changeAvat } from '../../../../../../utils/api_users';
import { RoomContext } from '../../../../../../Context/RoomContext';
import { socket } from '../../../../../../utils/socket';

const AvatarChoice = () => {

    const [cookies, setCookie] = useCookies(["user"]);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(false);
    const { room, setRoom } = useContext(RoomContext);
    const [show, setShow] = useState(true);
    const [avatar, setAvatar] = useState(cookies.user.avatar)
    const [showAvat, setShowavt] = useState(true)
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
                console.log(onSucessMessage)
            }, (onErrorMessage) => {
                console.log(onErrorMessage)
            })
    }


    return (
        <div>
            <Button onClick={handleShow}>
                edit avatar
                            </Button>
            <Row id={"showAvat"} className={styles.jumb}  hidden={show}>
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
        </div>

    );
}

export default AvatarChoice;