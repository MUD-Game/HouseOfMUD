/**
 * @module RabbitMQContext
 * @category React Contexts
 * @description Context for using RabbitMQ
 */

import React from 'react';
import { useAuth } from 'src/hooks/useAuth';
import { useGame } from 'src/hooks/useGame';
import { Client, IMessage } from '@stomp/stompjs';

type RabbitMQContextType = {
  login: (callback: VoidFunction, error: (error: string) => void) => void;
  logout: (callback: VoidFunction, error: (error: string) => void) => void;
  sendMessage: (message: string, callback: VoidFunction, error: (error: string) => void) => void;
  setChatSubscriber: (subscriber: (message: IMessage) => void) => void;
}

let RabbitMQContext = React.createContext<RabbitMQContextType>({} as RabbitMQContextType);

function RabbitMQProvider({ children }: { children: React.ReactNode }) {

  const { user } = useAuth();
  const { characterID, dungeon, verifyToken } = useGame();

  const rabbit = new Client({
    brokerURL: process.env.REACT_APP_RABBITMQ
  });
  // Diese Funktion wird immer aufgerufen wenn eine Nachricht ankommt
  let chatSubscriber: (message: IMessage) => void = () => { };
  let inventorySubscriber: (message: any) => void = () => { };
  let hudSubscriber: (message: any) => void = () => { };
  let minimapSubscriber: (message: any) => void = () => { };

  const processAction = (message: IMessage) =>{
    //TODO: Decide what type of message we received
    /**
     * If the action is a chat-message => call chatSubscriber etc.
     */
    chatSubscriber(message); // atm only chats

  }
  let login = (callback: VoidFunction, error: (error: string) => void) => {

    if (rabbit.active) {
      error('RabbitMQ is already connected');
      return;
    }

    rabbit.activate();
    let loginPayload = {
      action: 'login',
      user: user, //BUG: User weiß momentan nichts über die userid in der Designbeschreibung stehts aber
      character: characterID,
      verifyToken: verifyToken,
      data: {}
    }
    rabbit.onConnect = () => {
      rabbit.publish({
        destination: `/exchange/ServerExchange/${dungeon}`,
        body: JSON.stringify(loginPayload)
      });
      rabbit.subscribe(`/queue/${dungeon}-${characterID}`, (message: IMessage) => {
        processAction(message);
      });
    }
    callback();
  }

  let logout = (callback: VoidFunction, error: (error: string) => void) => {
    if (!rabbit.active) {
      error('RabbitMQ is not connected');
      return;
    }
    let logoutPayload = {
      action: 'logout',
      user: user, //BUG: User weiß momentan nichts über die userid in der Designbeschreibung stehts aber
      character: characterID,
      verifyToken: verifyToken,
      data: {}
    }
    rabbit.publish({
      destination: `/exchange/ServerExchange/${dungeon}`,
      body: JSON.stringify(logoutPayload)
    });
    rabbit.deactivate();
    callback();
  }

  let sendMessage = (message: string, callback: VoidFunction, error: (error: string) => void) => {
    let messagePayload = {
      action: 'message',
      user: user, //BUG: User weiß momentan nichts über die userid in der Designbeschreibung stehts aber
      character: characterID,
      verifyToken: verifyToken,
      data: {
        message
      }
    }

    rabbit.publish({
      destination: `/exchange/ServerExchange/${dungeon}`,
      body: JSON.stringify(messagePayload)
    });
    callback();

  }

  function setChatSubscriber(subscriber: (message: IMessage) => void) {
    chatSubscriber = subscriber;
  }

  let value = { login, logout, sendMessage, setChatSubscriber };

  return <RabbitMQContext.Provider value={value}>{children}</RabbitMQContext.Provider>;
}
export { RabbitMQContext, RabbitMQProvider };