/**
 * @module RabbitMQContext
 * @category React Contexts
 * @description Context for using RabbitMQ
 * @contextMethods {@linkcode login}, {@linkcode logout}, {@linkcode sendMessage}, {@linkcode setChatSubscriber}
 */

import React from 'react';
import { useAuth } from 'src/hooks/useAuth';
import { useGame } from 'src/hooks/useGame';
import { Client, IMessage } from '@stomp/stompjs';

export interface RabbitMQPayload {
  action: 'login' | 'logout' | 'message';
  user: string;
  character: string,
  verifyToken: string,
  data: any
}

export interface RabbitMQContextType {
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
  // TODO: Implement subscriber functions
  let inventorySubscriber: (message: any) => void = () => { };
  let hudSubscriber: (message: any) => void = () => { };
  let minimapSubscriber: (message: any) => void = () => { };

  let payloadTemplate = {
    user: '',
    character: '',
    verifyToken: ''
  }

  const processAction = (message: IMessage) =>{
    //TODO: Decide what type of message we received
    /**
     * If the action is a chat-message => call chatSubscriber etc.
     */
    chatSubscriber(message); // atm only chats

  }

  const sendPayload = (payload: RabbitMQPayload)=>{
    rabbit.publish({
      destination: `/exchange/ServerExchange/${dungeon}`,
      body: JSON.stringify(payload)
    });
  }

  let login = (callback: VoidFunction, error: (error: string) => void) => {

    if (rabbit.active) {
      error('RabbitMQ is already connected');
      return;
    }

    payloadTemplate = {
      user: user,
      character: characterID,
      verifyToken: verifyToken,
    }

    rabbit.activate();
    let loginPayload: RabbitMQPayload = {
      action: 'login',
      ...payloadTemplate,
      data: {}
    };
    rabbit.onConnect = () => {
      sendPayload(loginPayload);
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
    let logoutPayload:RabbitMQPayload = {
      action: 'logout',
      ...payloadTemplate,
      data: {}
    }
    sendPayload(logoutPayload);
    rabbit.deactivate();
    callback();
  }

  let sendMessage = (message: string, callback: VoidFunction, error: (error: string) => void) => {
    let messagePayload:RabbitMQPayload = {
      action: 'message',
      ...payloadTemplate,
      data: {
        message
      }
    }
    sendPayload(messagePayload);
    callback();

  }

  function setChatSubscriber(subscriber: (message: IMessage) => void) {
    chatSubscriber = subscriber;
  }

  let value = { login, logout, sendMessage, setChatSubscriber };

  return <RabbitMQContext.Provider value={value}>{children}</RabbitMQContext.Provider>;
}
export { RabbitMQContext, RabbitMQProvider };