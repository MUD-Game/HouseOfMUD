/**
 * @module VerifyEmail
 * @category React Components
 * @description Component to handle VerifyEmail-In
 * @hooks {@linkcode useAuth}
 * ```jsx
 * <>
 *  <AvailableCharactersLi/>[]
 * </>
 * ```
 */


import React from 'react'
import { Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from 'src/hooks/useAuth';
import Busy from '../../Busy';
type VerifyEmailProps = {}

interface LocationState {
    from: { pathname: string }
}
const VerifyEmail: React.FC<VerifyEmailProps> = (props) => {
    const [isVerifying, setIsVerifying] = React.useState(true);
    const [verifyMessage, setVerifyMessage] = React.useState("");
    let navigate = useNavigate();
    let location = useLocation();
    let auth = useAuth();
    let token = new URLSearchParams(location.search).get('token')!;
    auth.verifyEmail(token, () => {
        setIsVerifying(false);
        setVerifyMessage("E-Mail erfolgreich verifiziert! Sie werden in 3 Sekunden zum Login weitergeleitet");
        setTimeout(() => {
            navigate("/login");
        }, 3000);
    }, () => {
        setIsVerifying(false);
        setVerifyMessage("Ihre Mail konnte nicht verifiziert werden, entweder ihr Token ist ungültig oder Sie haben sich bereits verifiziert.");
    });


    return (
        <>
        {isVerifying ? <Busy /> : 
        <Container>
            <Row>
                <h1>Email-Verifizierung</h1>
            </Row>
            <Row>
                <p>
                    {verifyMessage}
                </p>
            </Row>
        </Container>
        }
        </>
    );
}

export default VerifyEmail;    