import React, { useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Messages from './Messages/messages';
import MessageSend from './MessageSend/messageSend';
import Accueil from './Accueil/accueil';
import { RoomContext } from '../../../../Context/RoomContext';

const Channel = (props) => {
    const Display = (props) => {
        const { room, setRoom } = useContext(RoomContext);
        if(room === null){
            return <Accueil/>;
        }else{
            return <Messages />
        }

    }

    return (
        <div>
            <Display />
            <MessageSend />
        </div>
    );
}

export default Channel;