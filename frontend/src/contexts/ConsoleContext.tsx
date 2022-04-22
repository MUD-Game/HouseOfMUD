import React, { useState } from 'react';
import { Toast, ToastContainer, ToastProps } from 'react-bootstrap';
import { ErrorResponse } from '../types/supervisor';

type ConsoleContextType = {
  log: (message: string, location?: string) => void;
  error: (message: string, location?: string) => void;
  warn: (message: string, location?: string) => void;
  supervisorerror: (err: ErrorResponse) => void;
}

let ConsoleContext = React.createContext<ConsoleContextType>({} as ConsoleContextType);

function ConsoleProvider({ children }: { children: React.ReactNode }) {

  interface ToastState {
    [key: string]: {
      type: 'danger' | 'warning' | 'info';
      message: string,
      location: string
    };
  }

  const [toasts, setToasts] = useState<ToastState>({});

  const [toastKey, setToastKey] = useState(0);
  const TOAST_DELAY = 5000;
  const TRANSITION_DELAY = 500;


  const destroyToastSoon = async (key: number) => {
    await new Promise(resolve => setTimeout(resolve, TOAST_DELAY + TRANSITION_DELAY));
    setToasts(toasts => {
      let newToasts = { ...toasts };
      delete newToasts[key];
      return newToasts;
    });
  }

  const addToast = (type: 'danger' | 'warning' | 'info', message: string, location?: string) => {
    location = location ? location : 'general';
    setToastKey(toastKey + 1);
    setToasts({ ...toasts, [toastKey]: { type, message, location } });
    destroyToastSoon(toastKey);
  }

  const log = (message: string, location?: string) => {
    addToast('info', message, location);
  }
  const warn = (message: string, location?: string) => {
    addToast('warning', message, location);
  }

  const supervisorerror = (err: ErrorResponse) => {
    addToast('info', err.error, "Supervisor");
  }

  const error = (message: string, location?: string) => {
    addToast('danger', message, location);

  }

  let value = { log, error, warn, supervisorerror };


  return (

    <ConsoleContext.Provider value={value}>
      <ToastContainer position="top-start" className="p-3 position-fixed">
        {Object.keys(toasts).length !== 0 ? Object.keys(toasts).map((toast, index) => {
          return (<ConsoleToast key={toast} location={toasts[toast].location} message={toasts[toast].message} type={toasts[toast].type} autohide={true} delay={TOAST_DELAY} />);
        }) : null}
      </ToastContainer>
      {children}
    </ConsoleContext.Provider>
  );
}

interface ConsoleToastProps extends ToastProps {
  type: 'danger' | 'warning' | 'info';
  message: string,
  location: string
}
const ConsoleToast: React.FC<ConsoleToastProps> = ({ type, message, location, autohide, delay }) => {

  const [show, setShow] = useState(true);
  return (
    <Toast bg={type} show={show} onClose={() => setShow(false)} autohide={autohide} delay={delay} animation={true}>
      <Toast.Header>
        <strong className="me-auto">{type}</strong>
        <small className="text-muted">{location}</small>
      </Toast.Header>
      <Toast.Body>{message}</Toast.Body>
    </Toast>
  )
}
export { ConsoleContext, ConsoleProvider };