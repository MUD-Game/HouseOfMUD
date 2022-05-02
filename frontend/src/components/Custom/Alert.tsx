import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { DisplaysMessageProps } from 'src/types/misc';
import { Alert as ReactAlert } from 'react-bootstrap';

const Alert: React.FC<DisplaysMessageProps & { type: 'error' | 'info', duration?: number }> = ({ setMessage, message, type, duration }) =>{

    const { t } = useTranslation();
    const alertRef = useRef<any>();
    

    const variant = type === 'error' ? 'danger' : 'info';

    useEffect(() => {
        alertRef?.current?.scrollIntoView({ behavior: 'smooth' });
    }, [message])

    if (message === '') {
        return null;
    }

    setTimeout(() => {
        setMessage('');
    }, duration || 5000);

    return (
        <ReactAlert transition={true} variant={variant} dismissible onClose={() => setMessage("")}>
            <ReactAlert.Heading>{t(`${type}.${message}.title`)}</ReactAlert.Heading>
            <p ref={alertRef}>
                {t(`${type}.${message}.text`)}
            </p>
        </ReactAlert>
    )
}

export default Alert;