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
import ConfirmationDialog, { ConfirmationDialogProps } from 'src/components/Modals/BasicModals/ConfirmationDialog';
import { useAuth } from 'src/hooks/useAuth';
type UserSettingsProps = {}

interface LocationState {
    from: { pathname: string }
}
const UserSettings: React.FC<UserSettingsProps> = (props) => {
    let navigate = useNavigate();
    let location = useLocation();
    let auth = useAuth();

    const [showConfirmationDialog, setShowConfirmationDialog] = React.useState<{ show: boolean, message: string, title: string, onConfirm: () => void }>({ show: false, message: "", title: "", onConfirm: () => { } });

    const showConfirmation = (title: string, message: string, onConfirm: () => void) => {
        setShowConfirmationDialog({
            show: true, message, title, onConfirm
        });
    }

    return (
        <>
            <ConfirmationDialog onHide={() => { setShowConfirmationDialog({ show: false, message: "", title: "", onConfirm: () => { } }) }} {...showConfirmationDialog} />
            <Container className="mt-5">
                <Row>
                    <div className="col-lg-4 col-md-6 col-sm-8">
                            <button className="btn mt-3 mb-5 drawn-border btn-red btn-xpadding" onClick={()=>{
                                showConfirmation('User löschen', 'Sicher dass du löschen...', ()=>{
                                    auth.deleteUser(() => {
                                        navigate('/register');
                                    },()=>{
                                        
                                    });
                                })
                            }}>User löschen</button> <br />
                    </div>
                </Row>
            </Container>
        </>
    )
}

export default UserSettings;    