import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Channels from './Channels/channels';
import Channel from './Channel/channel';
import { Col, Container, Row } from 'react-bootstrap';

const Core = (props) => {

    return (
        <Container fluid>
            <Row>
                <Col xs lg="1">
                    <Channels />
                </Col>
                <Col>
                    <Channel />
                </Col>
            </Row>
        </Container>
    );
}

export default Core;