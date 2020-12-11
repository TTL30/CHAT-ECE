import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
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
            <Button onClick={logout}>
                Log out
            </Button>
        </div>
    );
}

export default Header;