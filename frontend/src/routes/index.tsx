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
import { ConsoleProvider } from "src/contexts/ConsoleContext";
import DungeonConfigurator from '../components/DungeonConfigurator/index';
import { DungeonConfiguratorProvider } from "src/contexts/DungeonConfiguratorContext";
import VerifyEmail from "src/components/Authentication/VerifyEmail";
import Register from "src/components/Authentication/Register";
import UserSettings from "src/components/Authentication/UserSettings";
import Minimap from "src/components/Game/Minimap";
import ForgotLogin from "src/components/Authentication/FortgotLogin";
import ResetPassword from "src/components/Authentication/ResetPassword";


const IndexRouter: React.FC = (): ReactElement => {
    return (
        <ConsoleProvider>
            <BrowserRouter>
                <AuthProvider>
                    <Header />
                    <GameProvider>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/user-settings" element={<RequireAuth><UserSettings /></RequireAuth>} />
                            <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
                            <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
                            <Route path="/select-character" element={<RequireAuth><CharacterCreator /></RequireAuth>} />
                            <Route path="/dungeon-configurator" element={
                                <RequireAuth>
                                    <DungeonConfiguratorProvider>
                                        <DungeonConfigurator />
                                    </DungeonConfiguratorProvider>
                                </RequireAuth>} />
                            <Route path="/game" element={<RequireAuth>
                                <RabbitMQProvider>
                                    <Game />
                                </RabbitMQProvider>
                            </RequireAuth>} />
                            <Route path="/dungeon-master" element={<RequireAuth>
                                <RabbitMQProvider>
                                    <DungeonMaster />
                                </RabbitMQProvider>
                            </RequireAuth>} />
                            <Route path="/verify" element={<VerifyEmail />} />
                            <Route path="/requestpasswordreset" element={<ForgotLogin />} />
                            <Route path="/passwordreset" element={<ResetPassword />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </GameProvider>
                </AuthProvider>
            </BrowserRouter>
        </ConsoleProvider>
    );
};

export default IndexRouter;