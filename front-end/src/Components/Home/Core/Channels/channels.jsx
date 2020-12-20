import React, { useState, useEffect, useContext } from 'react';
import { Button, Form, Modal, ButtonGroup } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import styles from './channelStyle.module.css'
import { getChannels, getChannelsInfo, createChannel } from '../../../../utils/api_channels';
import { useCookies } from "react-cookie";
import { RoomContext } from '../../../../Context/RoomContext';
import { socket } from '../../../../utils/socket';
import Data from './Data/data';

const Channels = () => {
    
    const { register, handleSubmit, errors } = useForm();
    const [channelsUser, setChannels] = useState([]);
    const [cookies, setCookie] = useCookies(["user"]);
    const { room, setRoom } = useContext(RoomContext);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [show, setShow] = useState(false);

    //get channels user 
    const getChan = () => {
        getChannels(cookies.user.id,
            (onSuccessMessage) => {
                setChannels([]);
                onSuccessMessage.map((e, index) => {
                    getChannelsInfo(e, (onSuccessMessage2) => {
                        setChannels(channelsUser => [...channelsUser, onSuccessMessage2]);
                    }, (onErrorMessage2) => {
                        setChannels([]);
                    });
                });
            },
            (onErrorMessage) => {
                console.error(onErrorMessage);
                setChannels([]);
            });
    }

    //create new channel
    const newChannel = (data) => {
        createChannel(cookies.user.id, data.name,
            (onSuccessMessage) => {
                getChannelsInfo(onSuccessMessage.id, (onSuccessMessage2) => {
                    setChannels(channelsUser => [...channelsUser, onSuccessMessage2]);
                    handleClose();
                }, (onErrorMessage2) => {
                    setChannels([]);
                })
            },
            (onErrorMessage) => {
                console.log(onErrorMessage);
            }
        )
    }

    //call chan users
    useEffect(() => {
        getChan();
    }, [])

    useEffect(() => {
        socket.on('add chan', () => {
            getChan();

        });
    }, [])

    //switch room
    const changeRoom = (data) => {
        data.preventDefault();
        if (data.target.value) {
            const info = JSON.parse(data.target.value);
            setRoom({ 'id': info.id, 'id_cre': info.id_cre });
            if (room !== null && room.id !== info.id) {
                socket.emit('leave', { username: cookies.user.username, room: room.id }, (error) => {
                    if (error) {
                        alert(error);
                    }
                });
            }
            socket.emit('join', { username: cookies.user.username, room: info.id, email: cookies.user.email, avatar: cookies.user.avatar }, (error) => {
                if (error) {
                    alert(error);
                }
            });
        }
    }


    let listChannels = channelsUser.map((d, index) =>
        <Button key={d.id} style={{ marginTop: "3%", borderRadius: "12px", borderColor: "#7289da", color: "#7289da" }} variant="outline-info" className={styles.but} value={JSON.stringify({ id: d.id, id_cre: d.id_cre })} onClick={e => changeRoom(e)}>
            #__  {d.name}  __#
        </Button>
    );

    const acc = (e) => {
        e.preventDefault()
        localStorage.clear()
        setRoom(null)
        socket.emit('leave', { username: cookies.user.username, room: room.id }, (error) => {
            if (error) {
                alert(error);
            }
        });
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.accueil}>
                <button onClick={e => acc(e)} className={styles.accueilBut} v>
                    Home
                </button>
            </div>
            <div className={styles.listechan}>
                <ButtonGroup vertical>
                    {listChannels}
                </ButtonGroup>
                <div className={styles.add}>
                    <button onClick={handleShow} className={styles.butAdd} v>
                        +
                </button>
                </div>
            </div>
            <Data />

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton className={styles.mod} >
                    <Modal.Title>Create a channel</Modal.Title>
                </Modal.Header>
                <Modal.Body className={styles.mod} >
                    <Form onSubmit={handleSubmit(newChannel)} >
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Name : </Form.Label>
                            <Form.Control type="text" name="name" ref={register({ required: true, maxLength: 10 })} />
                            {errors.name && errors.name.type === "required" && <p className={styles.error}> <span>&#9888;</span> Merci de bien renseigner ce champ</p>}
                            {errors.name && errors.name.type === "maxLength" && <p className={styles.error}> <span>&#9888;</span> Limite de 10 char</p>}
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