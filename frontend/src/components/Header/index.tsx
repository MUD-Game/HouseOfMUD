/**
 * @module Header
 * @category React Components
 * @description Header component
 * @hooks {@linkcode useAuth}
 * @author Raphael Sack
 */
import React from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import { ArrowLeft, Gear } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'src/hooks/useAuth';
import Logo from '../../assets/LogoHOM.png';
import Alert from '../Custom/Alert';
import "./index.css"
type HeaderProps = {}

const Header: React.FC<HeaderProps> = (props) => {

    const auth = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const {t} = useTranslation();
 
    const [error, setError] = React.useState<string>("");

    if(location.pathname==='/game' || location.pathname==='/dungeon-master') { return null }
    return (
        <Container className="text-center">
            <Row>
                <Link to="/">
                    <img id="header-logo" src={Logo} alt="Logo HouseOfMUD" />
                </Link>
            </Row>
            {!(location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/passwordreset' || location.pathname === '/requestpasswordreset') ?
                <Row className="mt-3 align-items-center">
                    <Col className="text-start">
                        <p className="headline">{auth.user ? <>{t(`header.welcome`)} <Link to="/user-settings"><b>{auth.user}<Gear className="ali" size={25}/></b></Link></>: null}</p>
                    </Col>
                    <Col>
                        <Alert type="error" message={error} setMessage={setError}/>
                    </Col>
                    <Col className="text-end">
                            <button className="btn drawn-border btn-red btn-xpadding" onClick={() => {
                                auth.logout(() => {
                                    navigate("/login");
                                },setError);
                            }}>{t(`button.logout`)}</button> 
                    </Col>
                </Row>
            : null}
            <hr />
        </Container>
    )
}

export default Header;    