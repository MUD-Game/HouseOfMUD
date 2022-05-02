import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { DisplaysMessageProps } from 'src/types/misc';
import { Alert as ReactAlert } from 'react-bootstrap';

const Alert: React.FC<DisplaysMessageProps & {type: 'error' | 'info'}> = ({setMessage, message, type}) =>{

    const { t } = useTranslation();
    const alertRef = useRef<any>();
    

    const variant = type === 'error' ? 'danger' : 'info';

    useEffect(() => {
        alertRef?.current?.scrollIntoView({ behavior: 'smooth' });
    }, [message])

    if (message === '') {
        return null;
    }

    return (
        <ReactAlert variant={variant} dismissible onClose={() => setMessage("")}>
            <ReactAlert.Heading>{t(`${type}.${message}.title`)}</ReactAlert.Heading>
            <p ref={alertRef}>
                {t(`${type}.${message}.text`)}
            </p>
        </ReactAlert>
    )
}

export default Alert;