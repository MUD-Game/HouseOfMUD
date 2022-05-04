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
type RegisterProps = {}

const Register: React.FC<RegisterProps> = (props) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState("");
    const [info, setInfo] = React.useState("");
    let auth = useAuth();
    const {t} = useTranslation();

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        let formData = new FormData(event.currentTarget);
        let username = formData.get("username") as string;
        let email = formData.get("email") as string;
        let password = formData.get("password") as string;
        auth.register(email, username, password, () => {
            setIsLoading(false);
            setInfo("verifyemail");
        }, (err) => {
            console.log(err);
            setIsLoading(false);
            setError(err.toLowerCase());
        });
    }


    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <div className="col-lg-4 col-md-6 col-sm-8">
                <Alert message={error} setMessage={setError} type="error" />
                <Alert message={info} setMessage={setInfo} type="info" />
                {isLoading ? <Busy/> : 
                    <form onSubmit={handleSubmit}>
                        <div className="input-group py-2">
                            <input name="email" className="input-standard drawn-border" type="email" placeholder={t("login.email")} />
                        </div>
                        <div className="input-group py-2">
                                <input name="username" className="input-standard drawn-border" type="text" placeholder={t("login.username")} />
                        </div>
                        <div className="input-group pt-2">
                                <input name="password" className="input-standard drawn-border" type="password" placeholder={t("login.password")} />
                        </div>
                            <button className="btn mt-3 mb-5 drawn-border btn-green btn-xpadding" type="submit">{t("button.register")}</button> <br />
                            <span>{t("login.have_account")} <Link to="/login">{t("login.login_here")}</Link></span>
                    </form>
                    }
                </div>
            </Row>
        </Container>
    );
}

export default Register;    