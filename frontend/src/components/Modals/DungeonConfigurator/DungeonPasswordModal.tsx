import React, { useState } from 'react';
import { Modal, Button, Container } from 'react-bootstrap';
import '../index.css';
import { useTranslation } from 'react-i18next';
import MudInput from 'src/components/Custom/Input';
import { validator } from 'src/utils/validator';
export interface DungeonPasswordModalProps {
    show: boolean;
    onHide: () => void;
    onConfirm: (password:string) => void;
}
const DungeonPasswordModal: React.FC<DungeonPasswordModalProps> = ({
    onConfirm,
    onHide,
    show
}) => {
    const { t } = useTranslation();
    const [password, setPassword] = useState("");
    return (
        <Modal
            size="lg"
            show={show}
            onHide={onHide}
            centered
            className="confirmation-dialog">
            <Container>
                <Modal.Header>
                    <Modal.Title>
                        {t(`dungeon_keys.dungeon_password`)}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <MudInput
                        colmd={6}
                        name="dungeonpassword"
                        placeholder={t(`dungeon_keys.dungeon_password`)}
                        value={password}
                        onChange={event => {
                            setPassword(
                                validator.dungeonPassword(event.target)
                            );
                        }}
                    />
                </Modal.Body>
                <Modal.Footer className="justify-content-between">
                    <div className="col-3">
                        <Button
                            className="btn w-100 drawn-border btn-red"
                            onClick={onHide}>
                            {t(`button.cancel`)}
                        </Button>
                    </div>
                    <div className="col-6">
                        <Button
                            autoFocus
                            className="btn w-100 drawn-border  btn-green"
                            onClick={e => {
                                onConfirm(password);
                                onHide();
                            }}>
                            {t(`button.send`)}
                        </Button>
                    </div>
                </Modal.Footer>
            </Container>
        </Modal>
    );
};

export default DungeonPasswordModal;
