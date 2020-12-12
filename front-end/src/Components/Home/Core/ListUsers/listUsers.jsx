import React, { useState, useEffect, useContext } from 'react';
import { Button, Form, Modal, ButtonGroup, Breadcrumb, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import styles from './listUsersStyle.module.css'
import { getChannels, getChannelsInfo, createChannel } from '../../../../utils/api_channels';
import { useCookies } from "react-cookie";
import { RoomContext } from '../../../../Context/RoomContext';
import { socket } from '../../../../utils/socket';
import { FaUserAlt } from 'react-icons/fa';
import Gravatar from 'react-gravatar'

const ListUsers = () => {
    const { register, handleSubmit, errors } = useForm();
    const [channelsUser, setChannels] = useState([]);
    const [cookies, setCookie] = useCookies(["user"]);
    const { room, setRoom } = useContext(RoomContext);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [show, setShow] = useState(false);
    const [users, setUsers] = useState([]);

    //get channels user 


    //call chan users
    useEffect(() => {
        console.log("mai ")
        socket.on('roomData', ({ users }) => {
            console.log("jai recu " + JSON.stringify(users))
            setUsers(users);
        });
    }, [])

    //switch room
    const changeRoom = (data) => {
        data.preventDefault();
        const info = JSON.parse(data.target.value);
        setRoom({ 'id': info.id, 'id_cre': info.id_cre });
        if (room !== null && room.id !== info.id) {
            socket.emit('leave', { username: cookies.user.username, room: room.id }, (error) => {
                if (error) {
                    alert(error);
                }
            });
        }
        socket.emit('join', { username: cookies.user.username, room: info.id, type: 1,email:cookies.user.email }, (error) => {
            if (error) {
                alert(error);
            }
        });
    }

    let listUsers = users.map((d, index) =>
        <div className={styles.listuser}>
            <Row>
                <Col sm={3} style={{marginLeft:"1%"}}>
                    <Gravatar email={d.email} rating="pg" size={65} default="monsterid" className="CustomAvatar-image" style={{ borderRadius: "50%" }} />
                </Col>
                <Col sm={8} className={styles.us}>
                    <span key={d.id} style={{ marginTop: "5%", borderRadius: "12px" }} className={styles.user}>
                        {d.username}
                    </span>
                </Col>

            </Row>

        </div>

    );

    return (
        <div className={styles.wrapper}>
            <div className={styles.accueil}>
                <span className={styles.accueilBut} v>
                    Users in the channel
                </span>
            </div>
            <div className={styles.listechan}>
                {listUsers}
            </div>
        </div>
    );
}

export default ListUsers;