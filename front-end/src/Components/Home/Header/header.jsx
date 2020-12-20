import React from 'react';
import { Button, Navbar, Nav } from 'react-bootstrap';
import { Auth } from '../../../utils/auth';
import { useHistory } from 'react-router';
import { socket } from '../../../utils/socket';

const Header = (props) => {
    let history = useHistory();

    const logout = () => {
        Auth.signout(
            (onSuccessMessage) => {
                socket.emit('disconect', () => {
                });
                history.push("/login");
            })
    }

    return (
        <div>
            <Navbar fixed="top" style={{ backgroundColor: "#1e2124", borderBottom: "2px solid #424549" }}>
                <Navbar.Brand style={{ color: "#7289da" }} >ECE CHAT</Navbar.Brand>
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