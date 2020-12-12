import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Channels from './Channels/channels';
import Channel from './Channel/channel';
import { Col, Container, Row } from 'react-bootstrap';
import styles from './coreStyle.module.css';
import ListUsers from './ListUsers/listUsers';

const Core = () => {

    return (
        <Container fluid className={styles.cont}>
            <Row>
                <Col  sm={2}className={styles.chna}>
                     <Channels />
                 </Col>
                <Col sm={8} className={styles.mesMe}>
                   <Channel />
                 </Col>
                 <Col sm={2} className={styles.mesMe}>
                   <ListUsers />
                 </Col>
            </Row>
        </Container>
    );
}

export default Core;