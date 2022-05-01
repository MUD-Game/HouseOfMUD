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
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import ConfirmationDialog, { ConfirmationDialogProps } from 'src/components/Modals/BasicModals/ConfirmationDialog';
import { useAuth } from 'src/hooks/useAuth';
import MudSelect from '../../Custom/MudSelect';
type UserSettingsProps = {}

interface LocationState {
    from: { pathname: string }
}
const UserSettings: React.FC<UserSettingsProps> = (props) => {
    let navigate = useNavigate();
    const { t, i18n } = useTranslation();
    let auth = useAuth();
    console.log(i18n.language);

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
                <h1>{t("user_settings.title")}</h1>
                <h3>{t("user_settings.profile")}</h3>
                <hr />
                <Container>
                    <Row>
                        <div className="col-lg-4 col-md-6 col-sm-8">
                            <MudSelect colmd={12} defaultValue={i18n.language} label={t("user_settings.language.label")} onChange={(event) => {
                                i18n.changeLanguage(event.target.value,);
                            }}>
                                <option value="de-DE">{t("user_settings.language.de-DE")}</option>
                                <option value="en-US">{t("user_settings.language.en-US")}</option>
                            </MudSelect>
                        </div>
                    </Row>
                </Container>
                <br />
                <h3>{t("user_settings.account")}</h3>
                <hr />
                <Container>
                    <Row>
                        <div className="col-lg-4 col-md-6 col-sm-8">
                            <button className="btn mt-3 mb-5 drawn-border btn-red btn-xpadding" onClick={() => {
                                showConfirmation(t("user_settings.delete_user.confirmation.title"), t("user_settings.delete_user.confirmation.text"), () => {
                                    auth.deleteUser(() => {
                                        navigate('/login');
                                    }, () => {

                                    });
                                })
                            }}>{t("user_settings.delete_user.button")}</button> <br />
                        </div>
                    </Row>
                </Container>
                <br />

            </Container>
        </>
    )
}

export default UserSettings;    