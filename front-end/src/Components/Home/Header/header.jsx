import React, { useContext, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Navbar, NavDropdown, Form, Nav, FormControl } from 'react-bootstrap';
import { Auth } from '../../../utils/auth';
import { useHistory } from 'react-router';
import { socket } from '../../../utils/socket';
import { RoomContext } from '../../../Context/RoomContext';
import styles from './headerStyle.module.css';

const Header = (props) => {
    let history = useHistory();
    const [title, setTitle] = useState('Accueil')
    const logout = () => {
        Auth.signout(
            (onSuccessMessage) => {
                socket.emit('disconect', () => {
                });
                history.push("/login");
            })
    }
    const { room, setRoom } = useContext(RoomContext);
    useEffect(() => {
        setTitle('Room changed')
    },[room])

    return (
        <div>
            <Navbar fixed="top" style={{backgroundColor:"#1e2124"}}>
                <Navbar.Brand style={{color:"white"}} >ECE CHAT</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                    </Nav>
                    <Button onClick={logout} variant="outline-danger">
                        Log out
                     </Button>
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
}

export default Header;