/**
 * @module ResetPassword
 * @category React Components
 * @description Component to handle Loggin In
 * @hooks {@linkcode useAuth}
 */


import React from 'react'
import { Container, Row } from 'react-bootstrap';
import { Check2Circle, X } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import Busy from 'src/components/Busy';
import Alert from 'src/components/Custom/Alert';
import { useAuth } from 'src/hooks/useAuth';
import { validator } from 'src/utils/validator';
import { iconSize } from '../Register';
type ResetPasswordProps = {}


const ResetPassword: React.FC<ResetPasswordProps> = (props) => {
    let navigate = useNavigate();
    const [isLoading, setIsLoading] = React.useState(false);
    const [password, setPassword] = React.useState("");
    const [repeatPassword, setRepeatPassword] = React.useState("");
    const [error, setError] = React.useState("");
    const [pwError, setPwError] = React.useState("");
    const [confirmError, setConfirmError] = React.useState("");
    const { t } = useTranslation();
    let location = useLocation();
    let auth = useAuth();
    let token = new URLSearchParams(location.search).get('token');
    if (!token) {
        return <Navigate to="/requestpasswordreset" />
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        const passworderror = validator.password(password, repeatPassword)[0];
        if (passworderror) {
            setIsLoading(false);
            if (passworderror === "password.nomatch") {
                setPwError("");
                setConfirmError(t(passworderror));
            }
            else {
                setPwError(t(passworderror));
                setConfirmError("")
            }
            return;
        }

        auth.changePassword(token!, password, () => {
            setIsLoading(false);
            navigate('/login');
        },
        (error) => {
            setIsLoading(false);
            setError(error);
        });

    }

    const getLengthStatus = () => {
        let results = validator.password(password, password);
        let status = true;
        results.forEach(result => {
            if (result === "password.tooshort") status = false;
        });
        return status;
    }

    const getAlphaStatus = () => {
        let results = validator.password(password, password);
        let status = true;
        results.forEach(result => {
            if (result === "password.nolower") status = false;
            else if (result === "password.nocapital") status = false;
        });
        return status;
    }

    const getNumberStatus = () => {
        let results = validator.password(password, password);
        let status = true;
        results.forEach(result => {
            if (result === "password.nonumeral") status = false;
        });
        return status;
    }

    const getSymbolStatus = () => {
        let results = validator.password(password, password);
        let status = true;
        results.forEach(result => {
            if (result === "password.nosymbol") status = false;
        });
        return status;
    }

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <div className="col-lg-4 col-md-6 col-sm-8">
                    <Alert message={error} setMessage={setError} type="error" />
                    {isLoading ? <Busy /> :
                        <form onSubmit={handleSubmit} autoComplete="new-password">
                            <div className="input-group pt-2">
                                <input value={password} name="password" onChange={(event) => setPassword(event.target.value)} className="input-standard drawn-border" type="password" placeholder={t("login.new_password")} />
                                <span className="inputerror">{pwError}</span>
                            </div>
                            <div className="input-group pt-2">
                                <input value={repeatPassword} name="password" onChange={(event) => setRepeatPassword(event.target.value)} className="input-standard drawn-border" type="password" placeholder={t("login.confirm_new_password")} />
                                <span className="inputerror">{pwError}</span>
                                <span className="inputerror">{confirmError}</span>
                            </div>
                            <div className="col mt-3" id="pwrequirements">
                                <span>{t("password.requirements.title")}</span>
                                <Row>
                                    <div className="col-2 col-xl-1">{getLengthStatus() ? <Check2Circle size={iconSize} color='var(--green)' /> : <X size={iconSize} color='var(--red)' />}</div>
                                    <div className="col-10 col-xl-11"><span>{t("password.requirements.size")}</span></div>
                                </Row>
                                <Row>
                                    <div className="col-2 col-xl-1">{getAlphaStatus() ? <Check2Circle size={iconSize} color='var(--green)' /> : <X size={iconSize} color='var(--red)' />}</div>
                                    <div className="col-10 col-xl-11"><span>{t("password.requirements.alpha")}</span></div>
                                </Row>
                                <Row>
                                    <div className="col-2 col-xl-1">{getNumberStatus() ? <Check2Circle size={iconSize} color='var(--green)' /> : <X size={iconSize} color='var(--red)' />}</div>
                                    <div className="col-10 col-xl-11"><span>{t("password.requirements.number")}</span></div>
                                </Row>
                                <Row>
                                    <div className="col-2 col-xl-1">{getSymbolStatus() ? <Check2Circle size={iconSize} color='var(--green)' /> : <X size={iconSize} color='var(--red)' />}</div>
                                    <div className="col-10 col-xl-11"><span>{t("password.requirements.symbol")}</span></div>
                                </Row>
                            </div>
                            <button className="btn mt-3 drawn-border btn-green btn-xpadding" type="submit">{t("button.submit")}</button>
                        </form>
                    }
                </div>
            </Row>
        </Container>
    );
}

export default ResetPassword;    