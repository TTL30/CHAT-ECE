import React, { useContext, useEffect, useState } from 'react';
import { Button, Navbar, Form, Nav, Modal } from 'react-bootstrap';
import { AiOutlineUserAdd, AiFillDelete } from 'react-icons/ai';
import { useForm } from "react-hook-form";
import { RoomContext } from "../../../../../Context/RoomContext";
import { addUsToChan } from "../../../../../utils/api_users";
import styles from './navStyle.module.css';
import { useCookies } from 'react-cookie';
import { deleteChan, getChannelsInfo } from '../../../../../utils/api_channels';
import { socket } from '../../../../../utils/socket';


const NavRoom = () => {

    const [cookies, setCookie] = useCookies(["user"]);
    const handleClose = () => (setShow(false), setErrors(false), setSuccess(''));
    const handleShow = () => setShow(true);
    const [show, setShow] = useState(false);
    const handleCloseDel = () => (setShowDel(false));
    const handleShowDel = () => setShowDel(true);
    const [showDel, setShowDel] = useState(false);
    const [add, setAdd] = useState(true);
    const { register, handleSubmit, errors } = useForm();
    const [myerrors, setErrors] = useState('');
    const [mySuccess, setSuccess] = useState('');
    const { room, setRoom } = useContext(RoomContext);
    const [title, setTitle] = useState('');

    const addUserToChannel = (data) => {
        addUsToChan(room.id, data.username,
            (onSucessMessage) => {
                setErrors('');
                setSuccess(onSucessMessage);

            },
            (onErrorMessage) => {
                setErrors(onErrorMessage);
            });
    }

    const deleteChannel = () => {
        deleteChan(room.id,
            (onSuccessMessage) => {
                localStorage.setItem('room', null)
                socket.emit('room deleted', { room: room.id }, (error) => {
                    if (error) {
                        alert(error);
                    }
                });
                window.location.reload()
            }, (onErrorMessage) => {
                console.log(onErrorMessage)
            })
    }

    useEffect(() => {
        if (room.id_cre === cookies.user.id) {
            setAdd(false);
        } else setAdd(true);
        getChannelsInfo(room.id, (onSuccessMessage) => {
            setTitle(onSuccessMessage.name)

        }, (onErrorMessage) => {
            console.log(onErrorMessage)
        });
    }, [room]);

    const validationChecked = async (value) => {
        if (value === cookies.user.username + "/" + title) {
            return true;
        }
        return false;
    }


    return (
        <div>
            <Navbar style={{ backgroundColor: "#282b30", margin: "0 auto" }}>
                <Navbar.Brand style={{ color: "#7289da", fontSize: "1.5em" }} ><b>{title}</b></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                    </Nav>
                    <Button hidden={add} onClick={handleShow} variant="info" style={{ backgroundColor: "#6275bd", border: "0", marginRight: "3%" }} >
                        <AiOutlineUserAdd />
                    </Button>
                    <Button hidden={add} onClick={handleShowDel} variant="danger" style={{ border: "0" }} >
                        <AiFillDelete />
                    </Button>
                </Navbar.Collapse>
            </Navbar>
            <Modal show={show} onHide={handleClose} >
                <Modal.Header closeButton className={styles.mod}>
                    <Modal.Title>Add a user </Modal.Title>
                </Modal.Header>
                <Modal.Body className={styles.mod} >
                    <Form onSubmit={handleSubmit(addUserToChannel)} >
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Name : </Form.Label>
                            <Form.Control type="text" name="username" ref={register({ required: true, maxLength: 50 })} />
                            {errors.username && errors.username.type === "required" && <p className={styles.error}> <span>&#9888;</span> Merci de bien renseigner ce champ</p>}

                        </Form.Group>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                    </Button>
                        <Button variant="outline-success" type="submit">
                            Submit
                    </Button>
                        {myerrors &&
                            <div className="alert alert-danger mt-3" role="alert">
                                {myerrors}
                            </div>
                        }
                        {mySuccess &&
                            <div className="alert alert-success mt-3" role="alert">
                                {mySuccess}
                            </div>
                        }
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showDel} onHide={handleCloseDel} >
                <Modal.Header closeButton className={styles.mod}>
                    <Modal.Title>Delete your channel </Modal.Title>
                </Modal.Header>
                <Modal.Body className={styles.mod} >
                    <Form onSubmit={handleSubmit(deleteChannel)} >
                        <Form.Group controlId="formBasicEmail">
                            <p>
                                This action cannot be undone. This will permanently delete the channel <b>{title}</b>, messages, secrets, and remove all collaborator associations.
                            </p>
                            <Form.Label>Please type <b>{cookies.user.username}/{title} </b>to confirm.</Form.Label>
                            <Form.Control type="text" name="validation" ref={register({ required: true, validate: validationChecked })} />
                            {errors.validation && errors.validation.type === "required" && <p className={styles.error}> <span>&#9888;</span> Merci de bien renseigner ce champ</p>}
                            {errors.validation && errors.validation.type === "validate" && <p className={styles.error}> <span>&#9888;</span> Merci de verifier ce que vous avez écrits</p>}
                        </Form.Group>
                        <Button variant="secondary" onClick={handleCloseDel}>
                            Close
                    </Button>
                        <Button variant="outline-success" type="submit">
                            Submit
                    </Button>
                        {myerrors &&
                            <div className="alert alert-danger mt-3" role="alert">
                                {myerrors}
                            </div>
                        }
                        {mySuccess &&
                            <div className="alert alert-success mt-3" role="alert">
                                {mySuccess}
                            </div>
                        }
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default NavRoom;