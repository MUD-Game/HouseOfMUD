/**
 * @module ForgotLogin
 * @category React Components
 * @description Component to handle Loggin In
 * @hooks {@linkcode useAuth}
 */


import React from 'react'
import {Container, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Busy from 'src/components/Busy';
import Alert from 'src/components/Custom/Alert';
import { useAuth } from 'src/hooks/useAuth';
type ForgotLoginProps = {}

const ForgotLogin: React.FC<ForgotLoginProps> = (props) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [email, setEmail] = React.useState("");
    const [error, setError] = React.useState("");
    const [info, setInfo] = React.useState("");
    const {t} = useTranslation();
    let auth = useAuth();

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
            auth.requestResetPassword(email, ()=>{
                setIsLoading(false);
                setInfo(t("forgotlogin.email_sent"));
                setEmail("");
            },
            (error)=>{
                setIsLoading(false);
                setError(error);
            });
    }

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <div className="col-lg-4 col-md-6 col-sm-8">
                    <h3>{t("forgotlogin.title")}</h3>
                    <Alert message={error} setMessage={setError} type="error" />
                    <Alert message={info} setMessage={setInfo} type="info" />
                    {isLoading ? <Busy/> :
                        <form onSubmit={handleSubmit} autoComplete="off">
                            <span>{t("forgotlogin.text")}</span>
                            <input value={email} name="email" onChange={(event)=> setEmail(event.target.value)} className="input-standard drawn-border mt-3" type="email" placeholder={t("login.email")} />
                            <button className="btn mt-3 mb-3 drawn-border btn-green btn-xpadding" type="submit">{t("button.submit")}</button>
                        </form>
                    }
                </div>
            </Row>
        </Container>
    );
}

export default ForgotLogin;    