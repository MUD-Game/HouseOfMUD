/**
 * @module UserSettings
 * @category React Components
 * @description Component to show and change the user-settings
 * @author Raphael Sack
 * @hooks {@linkcode useAuth}
 */


import React, { FormEvent, useEffect } from 'react'
import { Container, Row } from 'react-bootstrap';
import { Send, ChevronLeft } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ConfirmationDialog from 'src/components/Modals/BasicModals/ConfirmationDialog';
import { useAuth } from 'src/hooks/useAuth';
import MudSelect from '../../Custom/Select';
import { useRabbitMQ } from "src/hooks/useRabbitMQ";
import Alert from 'src/components/Custom/Alert';
type UserSettingsProps = {}

const format = {
    reset: "\x1b[0m",
    bold: "\x1b[1m",
    underscore: "\x1b[4m",
    
    color: {
        black: "\x1b[30m",
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m"
    },

    rgb: (r: number, g: number, b: number) => {
        return `\x1b[38;2;${r};${g};${b}m`
    }
}

const UserSettings: React.FC<UserSettingsProps> = (props) => {
    let navigate = useNavigate();
    const { t, i18n } = useTranslation();
    let auth = useAuth();
    const { sendServerbroadcast } = useRabbitMQ();

    
    const [error, setError] = React.useState<string>("");
    const [showConfirmationDialog, setShowConfirmationDialog] = React.useState<{ show: boolean, message: string, title: string, onConfirm: () => void }>({ show: false, message: "", title: "", onConfirm: () => { } });
    const [serverbroadcast, setServerbroadcast] = React.useState("");

    const showConfirmation = (title: string, message: string, onConfirm: () => void) => {
        setShowConfirmationDialog({
            show: true, message, title, onConfirm
        });
    }
    
    const sendServerbroadcastMessage = (serverbroadcast: string) => {
        sendServerbroadcast(serverbroadcast, () => {
            // On Success
        }, (error) => {
            setError("rabbitmq.send");
        })
        setServerbroadcast("");
    }

    const handleConfirmation = (serverbroadcast: string) => {
        showConfirmation(t("user_settings.admin.serverbroadcast.title"), t("user_settings.admin.serverbroadcast.confirmation") + ": " + serverbroadcast, () => {
            sendServerbroadcastMessage(`\n\n${format.bold + format.color.red}${serverbroadcast}\n\n`);
        })
    }

    const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && serverbroadcast !== "") {
            handleConfirmation(serverbroadcast);
        }
    }

    return (
        <>
            <ConfirmationDialog onHide={() => { setShowConfirmationDialog({ show: false, message: "", title: "", onConfirm: () => { } }) }} {...showConfirmationDialog} />            
            <Alert type="error" message={error} setMessage={setError} />

            <Container >
                <div id="backbutton" onClick={() => navigate("/")} ><ChevronLeft size={30} /><span>{t("common.back")}</span></div>

            </Container>
            {auth.user === "root" ?

            <Container className="mt-4 mb-5">
                
                <Row>
                    <h1>{t("user_settings.admin.title")}</h1>
                </Row>

                <Row onKeyUp={handleEnterKey} className="h-100">
                    <h3>{t("user_settings.admin.serverbroadcast.title")}</h3>
                    <hr />
                    <div className="col-10">
                        <input type="text" name="serverbroadcast" placeholder={t("user_settings.admin.serverbroadcast.title")} className="input-standard drawn-border" required autoComplete='off' value={serverbroadcast} onChange={event => setServerbroadcast(event.target.value)} />
                    </div>
                    <div className="col-2">
                        <button className="btn w-100 drawn-border btn-green" onClick={ () => handleConfirmation(serverbroadcast) }>
                            <Send />
                        </button>
                    </div>
                </Row>
            </Container>
            : "" }

            <Container className="mb-5 mt-4">
                <Row>
                    <h1>{t("user_settings.title")}</h1>
                </Row>

                <Row className="mb-5">
                    <h3>{t("user_settings.profile")}</h3>
                    <hr />
                    <div className="col-lg-4 col-md-6 col-sm-8">
                        <MudSelect colmd={12} defaultValue={i18n.language} label={t("user_settings.language.label")} onChange={(event) => {
                            i18n.changeLanguage(event.target.value,);
                        }}>
                            <option value="de-DE">{t("user_settings.language.de-DE")}</option>
                            <option value="en-US">{t("user_settings.language.en-US")}</option>
                            <option value="nl-NL">{t("user_settings.language.nl-NL")}</option>
                            <option value="fr-FR">{t("user_settings.language.fr-FR")}</option>
                            <option value="es-ES">{t("user_settings.language.es-ES")}</option>
                            <option value="it-IT">{t("user_settings.language.it-IT")}</option>
                            <option value="pl-PL">{t("user_settings.language.pl-PL")}</option>
                        </MudSelect>
                    </div>
                </Row>

                <Row>
                    <h3>{t("user_settings.account")}</h3>
                    <hr />
                    <div className="col-lg-4 col-md-6 col-sm-8 mt-2">
                        <button className="btn drawn-border btn-red btn-xpadding" onClick={() => {
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
        </>
    )
}

export default UserSettings;    