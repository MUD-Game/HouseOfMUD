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
import Game from "src/components/Game";
import { RabbitMQProvider } from "src/contexts/RabbitMQContext";
import { ConsoleProvider } from "src/contexts/ConsoleContext";
import DungeonConfigurator from '../components/DungeonConfigurator/index';
import { DungeonConfiguratorProvider } from "src/contexts/DungeonConfiguratorContext";



const IndexRouter: React.FC = (): ReactElement => {
    return (
        <ConsoleProvider>

                <BrowserRouter>
            <AuthProvider>
                    <Header />
                    <GameProvider>
                        <Routes>
                            <Route path="/login" element={<Login />} />
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
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </GameProvider>
                </AuthProvider>
                </BrowserRouter>
        </ConsoleProvider>
    );
};

export default IndexRouter;