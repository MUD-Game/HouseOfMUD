/**
 * @module ResetPassword
 * @category React Components
 * @description Component to handle Loggin In
 * @hooks {@linkcode useAuth}
 */


import React from 'react'
import {Container, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import Busy from 'src/components/Busy';
import Alert from 'src/components/Custom/Alert';
import { useAuth } from 'src/hooks/useAuth';
type ResetPasswordProps = {}

const ResetPassword: React.FC<ResetPasswordProps> = (props) => {
    let navigate = useNavigate();
    const [isLoading, setIsLoading] = React.useState(false);
    const [password, setPassword] = React.useState("");
    const [repeatPassword, setRepeatPassword] = React.useState("");
    const [error, setError] = React.useState("");
    const {t} = useTranslation();
    let location = useLocation();
    let auth = useAuth();
    let token = new URLSearchParams(location.search).get('token');
    if (!token) {
        return <Navigate to="/requestpasswordreset" />
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        if (password === repeatPassword && token) {
            auth.changePassword(token, password, ()=>{
                setIsLoading(false);
                navigate('/login');
            },
            (error)=>{
                setIsLoading(false);
                setError(error);
            });
        }else{
            setIsLoading(false);
            setError("failvalidation.password_not_match");
        }
    }

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <div className="col-lg-4 col-md-6 col-sm-8">
                    <Alert message={error} setMessage={setError} type="error" />
                    {isLoading ? <Busy/> :
                        <form onSubmit={handleSubmit} autoComplete="new-password">
                        <div className="input-group pt-2">
                            <input value={password} name="password" onChange={(event)=> setPassword(event.target.value)}className="input-standard drawn-border" type="password" placeholder={t("login.new_password")} />
                        </div>
                        <div className="input-group pt-2">
                                <input value={repeatPassword} name="password" onChange={(event) => setRepeatPassword(event.target.value)} className="input-standard drawn-border" type="password" placeholder={t("login.confirm_new_password")} />
                        </div>
                            <button className="btn mt-3 mb-3 drawn-border btn-green" type="submit">{t("button.submit")}</button>
                    </form>
                    }
                </div>
            </Row>
        </Container>
    );
}

export default ResetPassword;    