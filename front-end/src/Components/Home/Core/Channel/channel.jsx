import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Messages from './Messages/messages';
import MessageSend from './MessageSend/messageSend';

const Channel = (props) => {

    return (
        <div>
            <Messages />
            <MessageSend />
        </div>
    );
}

export default Channel;