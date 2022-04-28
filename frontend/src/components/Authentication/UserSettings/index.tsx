/**
 * @module UserSettings
 * @category React Components
 * @description Component to handle UserSettings-In
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
type UserSettingsProps = {}

interface LocationState {
    from: { pathname: string }
}
const UserSettings: React.FC<UserSettingsProps> = (props) => {
    let navigate = useNavigate();
    let location = useLocation();
    let auth = useAuth();
    

    return (
        <Container className="mt-5">
            <Row>
                <div className="col-lg-4 col-md-6 col-sm-8">
                        <button className="btn mt-3 mb-5 drawn-border btn-red btn-xpadding" onClick={()=>{
                            auth.deleteUser(() => {
                                navigate('/register');
                            },()=>{
                                
                            });
                        }}>User löschen</button> <br />
                </div>
            </Row>
        </Container>
    );
}

export default UserSettings;    