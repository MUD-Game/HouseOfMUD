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
import Busy from 'src/components/Busy';
import { useAuth } from 'src/hooks/useAuth';
import { useMudConsole } from '../../../hooks/useMudConsole';
type LoginProps = {}

interface LocationState {
    from: { pathname: string }
}
const Login: React.FC<LoginProps> = (props) => {
    let navigate = useNavigate();
    const [isLoading, setIsLoading] = React.useState(false);
    const [password, setPassword] = React.useState("");
    const [username, setUsername] = React.useState("");
    const homsole = useMudConsole();
    let location = useLocation();
    let auth = useAuth();
    let from = (location.state as LocationState)?.from?.pathname || "/";

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        auth.login(username, password, () => {
            navigate(from, { replace: true });
        }, (error) => {
            homsole.error(error);
            setIsLoading(false);
        });
    }

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <div className="col-lg-4 col-md-6 col-sm-8">
                    {isLoading ? <Busy/> :
                        <form onSubmit={handleSubmit} autoComplete="new-password">
                        <div className="input-group py-2">
                            <input value={username} name="username" onChange={(event)=> setUsername(event.target.value)}className="input-standard drawn-border" type="text" placeholder="Username" />
                        </div>
                        <div className="input-group pt-2">
                            <input value={password} name="password" onChange={(event)=> setPassword(event.target.value)}className="input-standard drawn-border" type="password" placeholder="Passwort" />
                        </div>
                        {/* <span className="forgot-pw">Passwort vergessen? Klicke <Link to="/login">hier</Link></span> <br /> */}
                        <button className="btn mt-3 mb-5 drawn-border btn-green btn-xpadding" type="submit">Login</button> <br />
                        <span>Noch keinen Account? <Link to="/register">Hier registrieren</Link></span>
                    </form>
                    }
                </div>
            </Row>
        </Container>
    );
}

export default Login;    