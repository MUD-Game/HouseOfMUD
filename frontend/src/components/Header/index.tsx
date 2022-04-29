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
import { useTranslation } from 'react-i18next';
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
    const {t} = useTranslation();
    return (
        <Container className="text-center">
            <Row>
                <Link to="/">
                    <img id="header-logo" src={Logo} alt="Logo HouseOfMUD" />
                </Link>
            </Row>
            {location.pathname!=='/login' && location.pathname!=='/register' ?
                <Row className="mt-3 align-items-center">
                    <Col className="text-start">
                        <p className="headline">{auth.user ? <>{t(`header.welcome`)} <Link to="/user-settings"><b>{auth.user}</b></Link></>: null}</p>
                    </Col>
                    <Col className="text-end">
                            <button className="btn drawn-border btn-red btn-xpadding" onClick={() => {
                                auth.logout(() => {
                                    navigate("/login");
                                },()=>{
                                    homsole.error("Logout fehlgeschlagen");
                                });
                            }}>{t(`button.logout`)}</button> 
                    </Col>
                </Row>
            : null}
            <hr />
        </Container>
    )
}

export default Header;    