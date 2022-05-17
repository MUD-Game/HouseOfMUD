/**
 * @module AdminPanel
 * @category React Components
 * @description Component to show and change the user-settings
 * @author Raphael Sack
 * @hooks {@linkcode useAuth}
 */


import React, { FormEvent, useEffect, useState } from 'react'
import { Container, Row, Accordion } from 'react-bootstrap';
import { Send, ChevronLeft, ArrowCounterclockwise } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ConfirmationDialog from 'src/components/Modals/BasicModals/ConfirmationDialog';
import { useAuth } from 'src/hooks/useAuth';
import MudSelect from '../../Custom/Select';
import { useRabbitMQ } from "src/hooks/useRabbitMQ";
import Alert from 'src/components/Custom/Alert';
import Hosts from './Hosts';
import { AdminDungeonListResponse } from '@supervisor/api';
import { supervisor } from 'src/services/supervisor';
type AdminPanelProps = {}

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

const AdminPanel: React.FC<AdminPanelProps> = (props) => {
    let navigate = useNavigate();
    const { t, i18n } = useTranslation();
    let auth = useAuth();
    const { sendServerbroadcast } = useRabbitMQ();
    const [dungeons, setDungeons] = useState<AdminDungeonListResponse>();

    const [error, setError] = React.useState<string>("");
    const [showConfirmationDialog, setShowConfirmationDialog] = React.useState<{ show: boolean, message: string, title: string, onConfirm: () => void }>({ show: false, message: "", title: "", onConfirm: () => { } });
    const [serverbroadcast, setServerbroadcast] = React.useState("");

    useEffect(() => {
        fetchDungeons();
    }, []);

    const fetchDungeons = (callback?: VoidFunction) => {
        supervisor.getAdminDungeonList({}, (data) => { setDungeons(data); callback && callback() }, error => setError(error.error))
    }

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

            <Container className="mb-5 mt-4">
                <Row className="mb-5">
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
            </Container>

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
                        <button className="btn w-100 drawn-border btn-green" onClick={() => handleConfirmation(serverbroadcast)}>
                            <Send />
                        </button>
                    </div>
                </Row>
            </Container>

            <Container className="mt-4 mb-5">
                <Row>
                    <div className="col-8">
                        <h3>{t("user_settings.admin.dungeonlist")}</h3>
                    </div>
                    <div className="col-4 text-end">
                        <button onClick={(evt) => {
                            const target: React.MouseEvent<HTMLButtonElement, MouseEvent>["currentTarget"] = evt.currentTarget;
                            target.classList.add("spin");
                            target.disabled = true;
                            fetchDungeons(() => {
                                setTimeout(()=>{target.classList.remove("spin")}, 750);
                                target.disabled = false;
                            })
                        }} className="btn drawn-border btn-blue px-3" id="refreshButton" ><ArrowCounterclockwise size={30} /></button>
                    </div>
                    <hr />
                </Row>
                <Row>
                    <Accordion defaultActiveKey={['0']} alwaysOpen>
                        {
                            dungeons && Object.keys(dungeons!.online).map((host, index) => {
                                return ( <Hosts host={host} blocked={dungeons!.online[host].blocked} dungeons={dungeons!.online[host].dungeons} key={index} fetchDungeons={fetchDungeons} messageCallback={setError} /> );
                            })
                        }
                    </Accordion>
                </Row>
            </Container>
        </>
    )
}

export default AdminPanel;    