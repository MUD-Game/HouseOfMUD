import React from 'react';
import { useTranslation } from 'react-i18next';
import { DisplaysMessageProps } from 'src/types/misc';
import { Alert as ReactAlert } from 'react-bootstrap';

const Alert: React.FC<DisplaysMessageProps & {type: 'error' | 'info'}> = ({setMessage, message, type}) =>{

    const { t } = useTranslation();

    if(message === ''){
        return null;
    }

    const variant = type === 'error' ? 'danger' : 'info';

    return (
        <ReactAlert variant={variant} dismissible onClose={() => setMessage("")}>
            <ReactAlert.Heading>{t(`${type}.${message}.title`)}</ReactAlert.Heading>
            <p>
                {t(`${type}.${message}.text`)}
            </p>
        </ReactAlert>
    )
}

export default Alert;