import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import styles from './listUsersStyle.module.css'
import { socket } from '../../../../utils/socket';
import Gravatar from 'react-gravatar'

const ListUsers = () => {
    const [users, setUsers] = useState([]);

    //call chan users
    useEffect(() => {
        socket.on('roomData', ({ users }) => {
            setUsers(users);
        });
    }, [])

    const getRandomCol = () =>{
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    let listUsers = users.map((d, index) =>
        <div className={styles.listuser}>
            <Row>
                <Col sm={3} style={{marginLeft:"1%"}}>
                    <Gravatar email={d.email} rating="pg" size={55} default={d.avatar} className="CustomAvatar-image" style={{ borderRadius: "50%" }} />
                </Col>
                <Col sm={8} className={styles.us}>
                    <span key={d.id} style={{ marginTop: "5%", borderRadius: "12px", color:getRandomCol() }} className={styles.user}>
                        <b>{d.username}</b>
                    </span>
                </Col>
            </Row>
        </div>
    );

    return (
        <div className={styles.wrapper}>
            <div className={styles.accueil}>
                <span className={styles.accueilBut} v>
                    Connected
                </span>
            </div>
            <div className={styles.listechan}>
                {listUsers}
            </div>
        </div>
    );
}

export default ListUsers;