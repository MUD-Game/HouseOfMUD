import React from 'react'
import { Container } from 'react-bootstrap';
import { ChevronLeft } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import CryingLlama from 'src/components/Busy/CryingLlama';
import CryingLlamaPng from 'src/assets/LamaSad.png';
type NotFoundProps = {}

const NotFound: React.FC<NotFoundProps> = (props) => {
    const {t} = useTranslation();
    let navigate = useNavigate();
    return (
        <>
            <Container>
                <div id="backbutton" onClick={() => navigate("/")} ><ChevronLeft size={30} /><span>{t("common.back")}</span></div>
            </Container>
            <Container className="text-center" onClick={() => navigate("/")} style={{cursor: "pointer"}}>
                <h1 className="mb-5">{t(`common.404`)}</h1>
                <img src={CryingLlamaPng} alt="crying llama" className="img-fluid" style={{maxHeight: "30vh"}} />
            </Container>
        </>
    )
}

export default NotFound;    