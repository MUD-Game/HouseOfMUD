import React from 'react';
import { Modal, Button, Container } from 'react-bootstrap';
import './index.scss'
import '../index.css'
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
            <Container>
                <Modal.Header>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{message}</p>
                </Modal.Body>
                <Modal.Footer className="justify-content-between">
                    <div className="col-3">
                        <Button className="btn w-100 drawn-border btn-green" onClick={onHide}>
                            Abbrechen
                        </Button>
                    </div>
                    <div className="col-6">
                    <Button className="btn w-100 drawn-border btn-red" onClick={(e) => {
                        onConfirm();
                        onHide();
                    }}>
                        O.K.
                    </Button>
                        
                    </div>
                </Modal.Footer>
            </Container>
        </Modal>
    );
}


export default ConfirmationDialog;
