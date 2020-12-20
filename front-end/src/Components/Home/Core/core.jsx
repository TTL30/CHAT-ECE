import React from 'react';
import Channels from './Channels/channels';
import Channel from './Channel/channel';
import { Col, Container, Row } from 'react-bootstrap';
import styles from './coreStyle.module.css';
import ListUsers from './ListUsers/listUsers';

const Core = () => {

    return (
        <Container fluid className={styles.cont}>
            <Row>
                <Col sm={2}>
                    <Channels />
                </Col>
                <Col sm={8} >
                    <Channel />
                </Col>
                <Col sm={2}>
                    <ListUsers />
                </Col>
            </Row>
        </Container>
    );
}

export default Core;