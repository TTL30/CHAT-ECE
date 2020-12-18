import React, { useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Messages from './Messages/messages';
import MessageSend from './MessageSend/messageSend';
import Accueil from './Accueil/accueil';
import { RoomContext } from '../../../../Context/RoomContext';
import NavRoom from './Navbar/nav';

const Channel = (props) => {
    
    const Display = (props) => {
        const { room, setRoom } = useContext(RoomContext);
        if (room === null) {
            return <Accueil />;
        } else {
            return (
                <div>
                    <NavRoom />
                    <Messages />
                    <MessageSend />
                </div>
            )
        }

    }

    return (
        <div>
            <Display />
        </div>
    );
}

export default Channel;