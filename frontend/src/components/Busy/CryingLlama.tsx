import React from 'react';
import { Col, Row } from 'react-bootstrap';
import CryingLlamaPng from 'src/assets/LamaSad.png'
import "./index.css"
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const CryingLlama: React.FC = () => {

    const { t } = useTranslation();

    return (
        <div id="sadwrapper">
            <img src={CryingLlamaPng} alt="crying llama" className="img-fluid" />
            <span className="crying-title text-center mt-2">{t("cryingLlama.title")}</span>
            <span className="crying-text text-center mt-1"><Link to="/dungeon-configurator">{t("cryingLlama.text")}</Link></span>
        </div>
    );
}

export default CryingLlama;