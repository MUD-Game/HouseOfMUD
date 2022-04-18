import React, { ReactElement } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard  from "../components/Dashboard";
const IndexRouter: React.FC = (): ReactElement => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Dashboard user="Raphael"/>} />
            </Routes>
        </BrowserRouter>
    );
};

export default IndexRouter;