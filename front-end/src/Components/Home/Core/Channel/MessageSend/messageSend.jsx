import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { socket } from '../../../../../utils/socket'
import { useContext } from 'react';
import { RoomContext } from '../../../../../Context/RoomContext';
import { useCookies } from 'react-cookie';
import { sendMessageToChannel } from '../../../../../utils/api_messages';


const MessageSend = () => {

  const [msg, setMsg] = useState('');
  const { room, setRoom } = useContext(RoomContext)
  const [cookies, setCookie] = useCookies(["user"]);

  const sendMessage = (event) => {
    event.preventDefault();
    sendMessageToChannel(room.id, cookies.user.username, msg,
      (onSuccessMessage) => {
        socket.emit('chat message', msg, () => setMsg(''));
        console.log(onSuccessMessage)
      },
      (onErrorMessage) => {
        console.log(onErrorMessage);
      }
    )
  }

  return (
    <div>
      <input value={msg}
        onChange={(event) => setMsg(event.target.value)}
        onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
      />
    </div>
  );

}

export default MessageSend;
