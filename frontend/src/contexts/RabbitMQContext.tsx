/**
 * @module RabbitMQContext
 * @category React Contexts
 * @description Context for using RabbitMQ
 * @contextMethods {@linkcode login}, {@linkcode logout}, {@linkcode sendMessage}, {@linkcode setChatSubscriber}
 */

import React from 'react';
import { useAuth } from 'src/hooks/useAuth';
import { useGame } from 'src/hooks/useGame';
import { Client, IFrame, IMessage } from '@stomp/stompjs';
import { RabbitMQPayload } from 'src/types/rabbitMQ';

export interface RabbitMQContextType {
  login: (callback: VoidFunction, error: (error: string) => void) => void;
  logout: (callback: VoidFunction, error: (error: string) => void) => void;
  sendMessage: (message: string, callback: VoidFunction, error: (error: string) => void) => void;
  setChatSubscriber: (subscriber: (message: string) => void) => void;
  setErrorSubscriber: (subscriber: (message: any, ...optionalParams: any[]) => void) => void;
}

let RabbitMQContext = React.createContext<RabbitMQContextType>({} as RabbitMQContextType);

const rabbit = new Client({
  brokerURL: process.env.REACT_APP_RABBITMQ || 'wss://mud-ga.me:15673/ws',
});

var payloadTemplate = {
  user: '',
  character: '',
  verifyToken: ''
}

function RabbitMQProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { characterID, dungeon, verifyToken } = useGame();
  
  let chatSubscriber: (message: string) => void = () => { };

  /**
   * 
   * @param error 
   * The errorSubscriber gets all async Error messages (mostly RabbitMQ)
   */
  let errorSubscriber: (error: string) => void = (error) => { };
  // TODO: Implement subscriber functions
  let inventorySubscriber: (message: any) => void = () => { };
  let hudSubscriber: (message: any) => void = () => { };
  let minimapSubscriber: (message: any) => void = () => { };

  const processAction = (message: IMessage) => {
    try {
      let jsonData = JSON.parse(message.body);
      //TODO: Decide what type of message we received
      if (jsonData['action'] === undefined) {
        errorSubscriber("RabbitMQ-Message is missing a action-key");
        return;
      } else if (jsonData['data'] === undefined) {
        errorSubscriber("RabbitMQ-Message is missing a data");
        return;
      }
      switch (jsonData.action) {
        case 'message':
          chatSubscriber(jsonData.data); // atm only chats
          break;
        default:
          errorSubscriber("RabbitMQ-Action not implemented yet: " + jsonData.action);
      }
    } catch (err) {
      if (err instanceof SyntaxError) {
        errorSubscriber("Message Received from RabbitMQ is not valid JSON!: " + message.body);
      }
    }

  }

  const setErrorSubscriber = (subscriber: (message: any, ...optionalParams: any[]) => void) => {
    errorSubscriber = subscriber;
  }


  const sendPayload = (payload: RabbitMQPayload) => {
    if (rabbit.connected) {
      rabbit.publish({
        destination: `/exchange/ServerExchange/${dungeon}`,
        body: JSON.stringify(payload)
      });
    }
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
      }, { "auto-delete": "true" });
    }
    rabbit.onStompError = (receipt: IFrame) => {
      errorSubscriber(receipt.body);
    }
    callback();
  }

  let logout = (callback: VoidFunction, error: (error: string) => void) => {
    console.log(rabbit.active + ' ' + rabbit.connected);
    if (!rabbit.active) {
      error('RabbitMQ is not connected');
      return;
    }
    let logoutPayload: RabbitMQPayload = {
      action: 'logout',
      ...payloadTemplate,
      data: {}
    }
    sendPayload(logoutPayload);
    rabbit.deactivate();
    callback();
  }

  let sendMessage = (message: string, callback: VoidFunction, error: (error: string) => void) => {
    console.log(rabbit.active + ' ' + rabbit.connected);
    if (!rabbit.connected) {
      error("RabbitMQ is not connected");
      return;
    }
    let messagePayload: RabbitMQPayload = {
      action: 'message',
      ...payloadTemplate,
      data: {
        message
      }
    }
    sendPayload(messagePayload);
    callback();

  }

  function setChatSubscriber(subscriber: (message: string) => void) {
    chatSubscriber = subscriber;
  }

  let value = { login, logout, sendMessage, setChatSubscriber, setErrorSubscriber };

  return <RabbitMQContext.Provider value={value}>{children}</RabbitMQContext.Provider>;
}
export { RabbitMQContext, RabbitMQProvider };