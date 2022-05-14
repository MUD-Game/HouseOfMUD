/**
 * @module Register
 * @category React Components
 * @description Component used for user-Registration
 * @hooks {@linkcode useAuth}`
 */


import React from 'react'
import { Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from 'src/hooks/useAuth';
import Busy from 'src/components/Busy';
import { useTranslation } from 'react-i18next';
import Alert from 'src/components/Custom/Alert';
import { validator } from 'src/utils/validator';
import { Check2Circle, X } from 'react-bootstrap-icons';
type RegisterProps = {}

export const iconSize = 20;

const Register: React.FC<RegisterProps> = () => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState("");
    const [pwError, setPwError] = React.useState("");
    const [confirmError, setConfirmError] = React.useState("");
    const [info, setInfo] = React.useState("");
    let auth = useAuth();
    const { t } = useTranslation();

    const [username, setUsername] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirm, setConfirm] = React.useState("");

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        const passworderror = validator.password(password, confirm)[0];
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
        auth.register(email, username, password, () => {
            setIsLoading(false);
            setInfo("verifyemail");
        }, (err) => {
            console.log(err);
            setIsLoading(false);
            setError(err.toLowerCase());
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
            else if ( result === "password.nocapital") status = false;
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
                    <Alert message={info} setMessage={setInfo} type="info" />
                    {isLoading ? <Busy /> :
                        <form onSubmit={handleSubmit}>
                            <div className="input-group pt-2">
                                <input name="email" value={email} onChange={evt => setEmail(evt.target.value)} className="input-standard drawn-border" type="email" placeholder={t("login.email")} />
                            </div>
                            <div className="input-group pt-2">
                                <input name="username" value={username} onChange={evt => setUsername(evt.target.value)} className="input-standard drawn-border" type="text" placeholder={t("login.username")} />
                            </div>
                            <div className="input-group pt-3">
                                <input name="password" value={password} onChange={evt => setPassword(evt.target.value)} className="input-standard drawn-border" type="password" placeholder={t("login.password")} />
                                <span className="inputerror">{pwError}</span>
                            </div>
                            <div className="input-group pt-2">
                                <input name="confirm" value={confirm} onChange={evt => setConfirm(evt.target.value)} className="input-standard drawn-border" type="password" placeholder={t("login.confirm_password")} />
                                <span className="inputerror">{pwError}</span>
                                <span className="inputerror">{confirmError}</span>
                            </div>
                            <div className="col mt-4" id="pwrequirements">
                                <span>{t("password.requirements.title")}</span>
                                <Row>
                                    <div className="col-2 col-xl-1">{getLengthStatus() ? <Check2Circle size={iconSize} color='var(--green)' /> : <X size={iconSize} color='var(--red)' />}</div>
                                    <div className="col-10 col-xl-11">
                                        <span>{t("password.requirements.size")}</span>
                                    </div>
                                </Row>
                                <Row>
                                    <div className="col-2 col-xl-1">{getAlphaStatus() ? <Check2Circle size={iconSize} color='var(--green)' /> : <X size={iconSize} color='var(--red)' />}</div>
                                    <div className="col-10 col-xl-11">
                                        <span>{t("password.requirements.alpha")}</span>
                                    </div>
                                </Row>
                                <Row>
                                    <div className="col-2 col-xl-1">{getNumberStatus() ? <Check2Circle size={iconSize} color='var(--green)' /> : <X size={iconSize} color='var(--red)' />}</div>
                                    <div className="col-10 col-xl-11">
                                        <span>{t("password.requirements.number")}</span>
                                    </div>
                                </Row>
                                <Row>
                                    <div className="col-2 col-xl-1">{getSymbolStatus() ? <Check2Circle size={iconSize} color='var(--green)' /> : <X size={iconSize} color='var(--red)' />}</div>
                                    <div className="col-10 col-xl-11">
                                        <span>{t("password.requirements.symbol")}</span>
                                    </div>
                                </Row>
                            </div>
                            <button className="btn mt-3 mb-4 drawn-border btn-green btn-xpadding" type="submit">{t("button.register")}</button>
                            <div className="w-100 text-center">
                                <p>{t("login.have_account")} <Link to="/login">{t("login.login_here")}</Link></p>
                            </div>
                        </form>
                    }
                </div>
            </Row>
        </Container>
    );
}

export default Register;    

