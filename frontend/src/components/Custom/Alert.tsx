import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { DisplaysMessageProps } from 'src/types/misc';
import { Alert as ReactAlert } from 'react-bootstrap';
import "./index.css";

const Alert: React.FC<DisplaysMessageProps & { type: 'error' | 'info', duration?: number, title?: string }> = ({ setMessage, message, type, duration, title }) =>{

    const { t } = useTranslation();

    const variant = type === 'error' ? 'danger' : 'info';

    useEffect(() => {
        let autoHide: any;
        if(duration){
            autoHide = setTimeout(() => {
                setMessage('');
            }, duration);
        }

        return () => {
            if(duration){
                clearTimeout(autoHide);
            }
        }
    }, [message, duration, setMessage]);

    if (message === '') {
        return null;
    }




    return (
        <div className="alert-container">

        <ReactAlert transition={true} variant={variant} dismissible onClose={() => setMessage("")}>
            <ReactAlert.Heading>{title ? title : t(`${type}.${message}.title`)}</ReactAlert.Heading>
            <p>
                {title ? message : t(`${type}.${message}.text`)}
            </p>
        </ReactAlert>
        </div>
    )
}

export default Alert;