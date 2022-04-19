import React, { ReactElement } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../components/Login";
import Dashboard from "../components/Dashboard";
import NotFound from "../components/NotFound";
import RequireAuth from "../components/RequireAuth";
import Header from "../components/Header";
import { AuthProvider } from "src/contexts/AuthContext";
import { GameProvider } from "src/contexts/GameContext";
import CharacterCreator from "src/components/CharacterCreator";
const IndexRouter: React.FC = (): ReactElement => {
    return (
        <AuthProvider>
            <BrowserRouter>
            <Header/>
                <GameProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<RequireAuth><Dashboard/></RequireAuth>} />
                    <Route path="/select-character" element={<RequireAuth><CharacterCreator/></RequireAuth>} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
                </GameProvider>
            </BrowserRouter>
        </AuthProvider>
    );
};

export default IndexRouter;