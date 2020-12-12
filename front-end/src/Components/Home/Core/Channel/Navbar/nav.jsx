import React, { useContext, useEffect, useState } from 'react';
import { Button, Navbar, NavDropdown, Form, Nav, FormControl, Modal } from 'react-bootstrap';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { useForm } from "react-hook-form";
import { RoomContext } from "../../../../../Context/RoomContext";
import { addUsToChan } from "../../../../../utils/api_users";
import styles from './navStyle.module.css';
import { useCookies } from 'react-cookie';
import { getChannelsInfo } from '../../../../../utils/api_channels';


const NavRoom = (props) => {
    const [cookies, setCookie] = useCookies(["user"]);

    const handleClose = () => (setShow(false), setErrors(false));
    const handleShow = () => setShow(true);
    const [show, setShow] = useState(false);
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



    return (
        <div>
            <Navbar style={{ backgroundColor: "#282b30", margin: "0 auto" }}>
                <Navbar.Brand style={{ color: "white" }} >{title}</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                    </Nav>
                    <Button hidden={add} onClick={handleShow} variant="info" style={{backgroundColor:"#6275bd", border:"0"}} >
                        <AiOutlineUserAdd />
                    </Button>
                </Navbar.Collapse>
            </Navbar>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add a user </Modal.Title>
                </Modal.Header>
                <Modal.Body>
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
        </div>
    );
}

export default NavRoom;