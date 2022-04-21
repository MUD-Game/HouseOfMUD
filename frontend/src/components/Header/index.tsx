import React from 'react'
import { Col, Container, Row } from 'react-bootstrap';
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
                <a href="/">
                    <img id="header-logo" src={Logo} alt="Logo HouseOfMUD" />
                </a>
            </Row>
            <Row className="mt-5">
                <Col className="text-start">
                    <p className="headline">Wilkommen: <b>{ auth.user }</b></p>
                </Col>
                <Col className="text-end">
                    <button className="btn btn-danger" onClick={()=>{
                        auth.logout(()=>{
                        });
                        navigate("/login");                        
                    }}>Logout</button>
                </Col>
            </Row>
            <hr />
        </Container>
    )
}

export default Header;    