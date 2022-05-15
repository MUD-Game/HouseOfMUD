import React from 'react';
import { Modal, Button, Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
export interface DungeonMasterLeaveModalProps {
    show: boolean;
    playerList: string[];
    onHide: () => void;
    onShutdown: () => void;
    onDmGiveUp: (user:string) => void;
}
const DungeonMasterLeaveModal: React.FC<DungeonMasterLeaveModalProps> = ({ onShutdown, onDmGiveUp, onHide, show, playerList}) => {

    const {t} = useTranslation();
    const [user, setUser] = React.useState<string>('');

    return (
        <Modal size="lg" show={show} onHide={onHide} centered className='dungeonmasterleave' >
            <Container>
                <Modal.Header>
                    <Modal.Title>{t("dungeonmasterleave.title")}</Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    <p>{t("dungeonmasterleave.text")}</p>
                    <select defaultValue={"-1"} onChange={event => setUser(event.target.value)}>
                        <option value="-1" hidden>{t("dungeonmasterleave.select")}</option>
                        {playerList.map((user, index) => {
                            if (user !== 'dungeonmaster') {
                            return <option key={index} value={user}>{user}</option>
                            }
                        }
                        )}
                        </select>
                </Modal.Body>
                <Modal.Footer className="justify-content-between">
                    <div className="col-3">
                        <Button className="btn w-100 drawn-border btn-green" onClick={onHide}>
                            {t(`button.cancel`)}
                        </Button>
                    </div>
                    <div className="col-4">
                    <Button className="btn w-100 drawn-border btn-red" onClick={(e:any) => {
                        onShutdown();
                        onHide();
                    }}>
                            {t(`button.shutdown`)}
                    </Button>
                    </div>
                    <div className="col-4">
                    <Button className="btn w-100 drawn-border btn-red" onClick={(e:any) => {
                        onDmGiveUp(user);
                        onHide();
                    }}>
                            {t(`button.dmgive`)}
                    </Button>
                    </div>
                </Modal.Footer>
            </Container>
        </Modal>
    );
}


export default DungeonMasterLeaveModal;
