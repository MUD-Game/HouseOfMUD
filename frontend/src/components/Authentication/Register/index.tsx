/**
 * @module Register
 * @category React Components
 * @description Component to handle Register-In
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
import $ from 'jquery';
import { useAuth } from 'src/hooks/useAuth';
import { useMudConsole } from 'src/hooks/useMudConsole';
import Busy from 'src/components/Busy';
type RegisterProps = {}

interface LocationState {
    from: { pathname: string }
}
const Register: React.FC<RegisterProps> = (props) => {
    const [isLoading, setIsLoading] = React.useState(false);
    let navigate = useNavigate();
    let auth = useAuth();
    const homsole = useMudConsole();

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        let formData = new FormData(event.currentTarget);
        let username = formData.get("username") as string;
        let email = formData.get("email") as string;
        let password = formData.get("password") as string;
        auth.register(email, username, password, () => {
            homsole.log("Erfolgreich registriert! Bitte bestätige deine Email-Adresse.");
            navigate('/login');
        }, () => {
            setIsLoading(false);

            homsole.error("Fehler beim Registrieren! Versuchen Sie es erneut");
        });
    }


    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <div className="col-lg-4 col-md-6 col-sm-8">
                {isLoading ? <Busy/> : 
                    <form onSubmit={handleSubmit}>
                        <div className="input-group py-2">
                            <input name="email" className="input-standard drawn-border" type="email" placeholder="E-Mail Adresse" />
                        </div>
                        <div className="input-group py-2">
                            <input name="username" className="input-standard drawn-border" type="text" placeholder="Username" />
                        </div>
                        <div className="input-group pt-2">
                            <input name="password" className="input-standard drawn-border" type="password" placeholder="Passwort" />
                        </div>
                        <button className="btn mt-3 mb-5 drawn-border btn-green btn-xpadding" type="submit">Register</button> <br />
                        <span>Account vorhanden? <Link to="/login">Hier anmelden</Link></span>
                    </form>
                    }
                </div>
            </Row>
        </Container>
    );
}

export default Register;    