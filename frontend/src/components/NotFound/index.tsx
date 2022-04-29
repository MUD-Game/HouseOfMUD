import React from 'react'
import { Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
type NotFoundProps = {}

const NotFound: React.FC<NotFoundProps> = (props) => {
    const {t} = useTranslation();
    return (
        <Container>
            <h1>{t(`common.404`)}</h1>
        </Container>
    )
}

export default NotFound;    