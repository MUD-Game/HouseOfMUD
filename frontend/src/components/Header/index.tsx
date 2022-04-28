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
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'src/hooks/useAuth';
import { useMudConsole } from 'src/hooks/useMudConsole';
import Logo from '../../assets/LogoHOM.png';
type HeaderProps = {}

const Header: React.FC<HeaderProps> = (props) => {

    const auth = useAuth();
    const homsole = useMudConsole();
    const location = useLocation();
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
                    <p className="headline">{auth.user ? <>Wilkommen <Link to="/user-settings"><b>{auth.user}</b></Link></>: null}</p>
                </Col>
                <Col className="text-end">
                    {location.pathname!=='/login' ?
                        <button className="btn drawn-border btn-red btn-xpadding" onClick={() => {
                            auth.logout(() => {
                                navigate("/login");
                            },()=>{
                                homsole.error("Logout fehlgeschlagen");
                            });
                        }}>Logout</button> 
                        : null}
                </Col>
            </Row>
            <hr />
        </Container>
    )
}

export default Header;    