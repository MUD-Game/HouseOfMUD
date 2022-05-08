/**
 * @module VerifyEmail
 * @category React Components
 * @description Component to verify the email of a user and either redirects him to the login page or shows an error
 * @hooks {@linkcode useAuth}
 */


import React, { useEffect } from 'react'
import { Container, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from 'src/hooks/useAuth';
import Busy from '../../Busy';
type VerifyEmailProps = {}


const VerifyEmail: React.FC<VerifyEmailProps> = (props) => {
    const [isVerifying, setIsVerifying] = React.useState(true);
    const [verifyMessage, setVerifyMessage] = React.useState("");
    let navigate = useNavigate();
    let location = useLocation();
    const {t} = useTranslation();
    let auth = useAuth();
    let token = new URLSearchParams(location.search).get('token')!;
    useEffect(() => {
        auth.verifyEmail(token, () => {
            setIsVerifying(false);
            setVerifyMessage(t("verify_email.success"));
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        }, () => {
            setIsVerifying(false);
            setVerifyMessage(t("verify_email.error"));
        });
    }, [auth, navigate, token, t]);

   


    return (
        <>
        {isVerifying ? <Busy /> : 
        <Container>
            <Row>
                <h1>{t("verify_email.title")}</h1>
            </Row>
            <Row>
                <p>
                    {verifyMessage === "" ? <Busy/> : verifyMessage}
                </p>
            </Row>
        </Container>
        }
        </>
    );
}

export default VerifyEmail;    