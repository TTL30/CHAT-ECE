import React, { useState, useEffect, useContext } from 'react';
import { Button, Form, Modal, ButtonGroup } from 'react-bootstrap'
import { useForm } from 'react-hook-form';
import styles from './channelStyle.module.css'

import { getChannels, getChannelsInfo, createChannel } from '../../../../utils/api_channels'
import { useCookies } from "react-cookie";
import { RoomContext } from '../../../../Context/RoomContext';
import { socket } from '../../../../utils/socket'

const Channels = () => {
    const { register, handleSubmit, errors } = useForm();
    const [channelsUser, setChannels] = useState([]);
    const [cookies, setCookie] = useCookies(["user"]);
    const {room, setRoom} = useContext(RoomContext);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [show, setShow] = useState(false);
    const [addU, setAddU] = useState(false);

    const getChan = () => {
        getChannels(cookies.user.id,
            (onSuccessMessage) => {
                setChannels([])
                onSuccessMessage.map((e, index) => {
                    getChannelsInfo(e, (onSuccessMessage2) => {
                        setChannels(channelsUser => [...channelsUser, onSuccessMessage2])
                        
                    }, (onErrorMessage2) => {
                        console.log(onErrorMessage2)
                        setChannels([])
                    })
                })
            },
            (onErrorMessage) => {
                console.error(onErrorMessage)
                setChannels([])
            })
    }

    const newChannel = (data) => {
        createChannel(cookies.user.id, data.name,
            (onSuccessMessage) => {
                getChannelsInfo(onSuccessMessage.id, (onSuccessMessage2) => {
                    setChannels(channelsUser => [...channelsUser, onSuccessMessage2])
                    handleClose()
                }, (onErrorMessage2) => {
                    console.log(onErrorMessage2)
                    setChannels([])
                })
            },
            (onErrorMessage) => {
                console.log(onErrorMessage)
            }
        )
    }

    useEffect(() => {
        getChan();
    },
        []
    )
  
 
    const changeRoom = (data) =>{
        const info = JSON.parse(data.target.value)
        setRoom({'id':info.id, 'id_cre':info.id_cre})
        socket.emit('leave', {username:cookies.user.username, room:room.id }, (error) => {
            if (error) {
              alert(error);
            }
          });
        socket.emit('join', { username:cookies.user.username, room:info.id }, (error) => {
            if (error) {
              alert(error);
            }
          });
    }
    let listChannels = channelsUser.map((d, index) =>
        
        <Button key={d.id} variant="outline-secondary" className={styles.but} value={JSON.stringify({id:d.id, id_cre:d.id_cre})}  onClick={e => changeRoom(e)}>
            {d.name}
        </Button>
    )

    return (
        <div className={styles.wrapper}>
            <ButtonGroup vertical>
                {listChannels}
                <Button onClick={handleShow}>
                <h3>+</h3>
            </Button>
            </ButtonGroup>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create a channel</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit(newChannel)} >
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Name : </Form.Label>
                            <Form.Control type="text" name="name" ref={register({ required: true, maxLength: 50 })} />
                        </Form.Group>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                    </Button>
                        <Button variant="outline-success" type="submit">
                            Submit
                    </Button>
                    </Form>
                </Modal.Body>
            </Modal> 
        </div>
    );
}

export default Channels;