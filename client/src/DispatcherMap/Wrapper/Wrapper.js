import React from 'react';
import Map from '../Map/Map';
import { Container, Row } from "react-bootstrap";



function DispatcherMapWrapper(){

    return(
        <Container>
            <Row>
                <Map />
            </Row>
        </Container>
    )


}
export default DispatcherMapWrapper;