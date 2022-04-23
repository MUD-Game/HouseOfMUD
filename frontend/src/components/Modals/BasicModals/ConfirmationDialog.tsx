import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import './index.scss'
export interface ConfirmationDialogProps {
    show: boolean;
    onHide: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ onConfirm, onHide, show, title, message }) => {

    return (
        <Modal size="lg" show={show} onHide={onHide} centered className='confirmation-dialog' >
            <Modal.Header>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{message}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Abbrechen
                </Button>
                <Button autoFocus variant="danger" onClick={(e) => {
                    onConfirm();
                    onHide();
                }}>
                    O.K.
                </Button>
            </Modal.Footer>
        </Modal>
    );
}


export default ConfirmationDialog;
