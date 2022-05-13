import React from 'react';
import { Col, Row } from 'react-bootstrap';
import CryingLlamaPng from 'src/assets/LamaSad.png'
import "./index.css"
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const CryingLlama : React.FC = () => {

    const {t} = useTranslation();

    return (
        <div id="sadwrapper">
                 
             <img src={CryingLlamaPng} alt="crying llama" className="img-fluid" />
                 
                 <div>
                        <h1>{t("cryingLlama.title")}</h1>
                <h4><Link to="/dungeon-configurator">{t("cryingLlama.text")}</Link></h4>
                 </div>
             </div>
    );
}

export default CryingLlama;