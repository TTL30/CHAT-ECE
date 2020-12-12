import React, { useState, useEffect, useContext } from 'react';
import { Button, Form, Modal, ButtonGroup, Dropdown, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import styles from './dataStyle.module.css'
import { useCookies } from "react-cookie";
import { FaUserAlt } from 'react-icons/fa';
import { FiSettings } from 'react-icons/fi';
import Gravatar from 'react-gravatar'

const Data = () => {
    const [cookies, setCookie] = useCookies(["user"]);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [show, setShow] = useState(false);
    const test = () => {
        console.log("hey")
    }
    return (
        <div className={styles.wrapper}>
            <div className={styles.data}>
                <Row>
                    <Col>
                    <Gravatar email={cookies.user.email}  rating="pg" default="monsterid" className="CustomAvatar-image" style={{ borderRadius:"50%"}}/>
                   </Col>
                    <Col>
                        <span>{cookies.user.username}</span>
                    </Col>
                    <Col>
                        <FiSettings onClick={handleShow} style={{ cursor: 'pointer' }} />

                    </Col>
                </Row>
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Settings </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formBasicUser">
                            <Form.Label>Username : </Form.Label>
                            <Form.Control disabled type="text" name="name" value={cookies.user.username} />
                        </Form.Group>
                        <Form.Group controlId="formBasicUser">
                            <Form.Label>Email : </Form.Label>
                            <Form.Control disabled type="text" name="name" value={cookies.user.email} />
                        </Form.Group>
                        <Form.Group controlId="formBasicUser">
                            <Dropdown>
                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                    Dropdown Button
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item >Action</Dropdown.Item>
                                    <Dropdown.Item >Another action</Dropdown.Item>
                                    <Dropdown.Item >Something else</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
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

export default Data;