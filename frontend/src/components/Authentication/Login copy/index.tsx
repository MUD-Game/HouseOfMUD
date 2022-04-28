/**
 * @module Login
 * @category React Components
 * @description Component to handle Login-In
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
type LoginProps = {}

interface LocationState {
    from: { pathname: string }
}
const Login: React.FC<LoginProps> = (props) => {
    let navigate = useNavigate();
    let location = useLocation();
    let auth = useAuth();
    let from = (location.state as LocationState)?.from?.pathname || "/";

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        let formData = new FormData(event.currentTarget);
        let username = formData.get("username") as string;
        let password = formData.get("password") as string;
        auth.login(username, password, () => {
            navigate(from, { replace: true });
        }, () => {
        });
    }

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <div className="col-lg-4 col-md-6 col-sm-8">
                    <h4>Registrierung momentan nicht möglich</h4>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group py-2">
                            <input name="username" className="input-standard drawn-border" type="text" placeholder="Username" />
                        </div>
                        <div className="input-group pt-2">
                            <input name="password" className="input-standard drawn-border" type="password" placeholder="Passwort" />
                        </div>
                        <span className="forgot-pw">Passwort vergessen? Klicke <Link to="/login">hier</Link></span> <br />
                        <button className="btn mt-3 mb-5 drawn-border btn-green btn-xpadding" type="submit">Login</button> <br />
                        <span>Noch keinen Account? <Link to="/login">Hier registrieren</Link></span>
                    </form>
                </div>
            </Row>
        </Container>
    );
}

export default Login;    