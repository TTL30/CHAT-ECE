import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import { Auth } from '../../../utils/auth';
import { Redirect, Route, useHistory } from 'react-router';
import { RoomContext } from '../../../Context/RoomContext';
import { useContext } from 'react';

const Header = (props) => {
    const {room, setRoom} = useContext(RoomContext);

    let history = useHistory();


    const logout = () => {
        Auth.signout(
            (onSuccessMessage) => {
                setRoom()
                console.log(onSuccessMessage)
                history.push("/login")
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