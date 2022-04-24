import React from 'react'
import { Container } from 'react-bootstrap';
type NotFoundProps = {}

const NotFound: React.FC<NotFoundProps> = (props) => {
    return (
        <Container>
            <h1>404 - Not Found!</h1>
        </Container>
    )
}

export default NotFound;    