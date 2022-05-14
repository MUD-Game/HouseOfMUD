/**
 * @module App-Routes
 * @description Routes for the app
 * @author Raphael Sack
 * @category Routes
 */
import React, { ReactElement } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../components/Authentication/Login";
import Dashboard from "../components/Dashboard";
import NotFound from "../components/NotFound";
import RequireAuth from "../components/Authentication/RequireAuth";
import Header from "../components/Header";
import { AuthProvider } from "src/contexts/AuthContext";
import { GameProvider } from "src/contexts/GameContext";
import CharacterCreator from "src/components/CharacterCreator";
import Game from "src/components/Game";
import DungeonMaster from "src/components/DungeonMaster"
import { RabbitMQProvider } from "src/contexts/RabbitMQContext";
import DungeonConfigurator from '../components/DungeonConfigurator/index';
import { DungeonConfiguratorProvider } from "src/contexts/DungeonConfiguratorContext";
import VerifyEmail from "src/components/Authentication/VerifyEmail";
import Register from "src/components/Authentication/Register";
import UserSettings from "src/components/Authentication/UserSettings";
import ForgotLogin from "src/components/Authentication/FortgotLogin";
import ResetPassword from "src/components/Authentication/ResetPassword";
import AdminPanel from "src/components/Authentication/AdminPanel";


const IndexRouter: React.FC = (): ReactElement => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Header />
                <GameProvider>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        <Route path="/user-settings" element={
                            <RequireAuth group="user">
                                <UserSettings />
                            </RequireAuth>} />
                        <Route path="/" element={<RequireAuth group="user"><Dashboard /></RequireAuth>} />
                        <Route path="/dashboard" element={<RequireAuth group="user"><Dashboard /></RequireAuth>} />
                        <Route path="/select-character" element={<RequireAuth group="user"><CharacterCreator /></RequireAuth>} />
                        <Route path="/dungeon-configurator" element={
                            <RequireAuth group="user">
                                <DungeonConfiguratorProvider>
                                    <DungeonConfigurator />
                                </DungeonConfiguratorProvider>
                            </RequireAuth>} />
                        <Route path="/game" element={<RequireAuth group="user">
                            <RabbitMQProvider>
                                <Game />
                            </RabbitMQProvider>
                        </RequireAuth>} />
                        <Route path="/dungeon-master" element={<RequireAuth group="user">
                            <RabbitMQProvider>
                                <DungeonMaster />
                            </RabbitMQProvider>
                        </RequireAuth>} />
                        <Route path="/verify" element={<VerifyEmail />} />
                        <Route path="/requestpasswordreset" element={<ForgotLogin />} />
                        <Route path="/passwordreset" element={<ResetPassword />} />
                        <Route path="/admin-panel" element={
                        <RequireAuth group="admin">                                 
                        <RabbitMQProvider>  
                            <AdminPanel />
                        </RabbitMQProvider>
                        </RequireAuth>} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </GameProvider>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default IndexRouter;