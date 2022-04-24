/**
 * @module Header
 * @category React Components
 * @description Header component
 * ```jsx
 *  <LogoutButton />
 * ```
 */
import React from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'src/hooks/useAuth';
import Logo from '../../assets/LogoHOM.png';
type HeaderProps = {}

const Header: React.FC<HeaderProps> = (props) => {
    const auth = useAuth();
    const navigate = useNavigate();
    return (
        <Container className="text-center">
            <Row>
                <Link to="/">
                    <img id="header-logo" src={Logo} alt="Logo HouseOfMUD" />
                </Link>
            </Row>
            <Row className="mt-5 align-items-center">
                <Col className="text-start">
                    <p className="headline">{auth.user? "Willkommen: ": "Anmelden"}<b>{auth.user}</b></p>
                </Col>
                <Col className="text-end">
                    <button className="btn drawn-border btn-red btn-xpadding" onClick={() => {
                        auth.logout(() => {
                            navigate("/login");
                        });
                    }}>Logout</button>
                </Col>
            </Row>
            <hr />
        </Container>
    )
}

export default Header;    