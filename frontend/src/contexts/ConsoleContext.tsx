import React, { useState } from 'react';
import { Button, Toast, Col, Row, ToastContainer, ToastHeader, ToastProps } from 'react-bootstrap';

type ConsoleContextType = {
  log: (message:string, location?:string) => void;
}

let ConsoleContext = React.createContext<ConsoleContextType>({} as ConsoleContextType);

function ConsoleProvider({ children }: { children: React.ReactNode }) {

  const [toasts, setToasts] = useState<{
    type: 'danger' | 'warning' | 'info';
    message: string,
    location: string
  }[]>([]);

  const log = (message:string, location?:string)=>{
    location = location ? location : 'general';
    setToasts([...toasts, {
      type: 'info',
      message,
      location
    }])
  }


  let value = {log};

  return (

    <ConsoleContext.Provider value={value}>
    <ToastContainer position="top-start" className="p-3 position-fixed">
      {toasts.length !== 0 ? toasts.map((toast,index)=>{
        return (<ConsoleToast key={index} {...toast}/>);
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
const ConsoleToast : React.FC<ConsoleToastProps> = ({type,message,location, autohide}) =>{
  const [show, setShow] = useState(true);
  useState(()=>{
    console.log("mounted");
    return ()=>{
      console.log("unmounted")
    }
  })
  return (
      <Toast bg={type} show={show} onClose={() => setShow(false)} autohide={autohide} delay={5000}>
             <Toast.Header>
        <strong className="me-auto">{type}</strong>
        <small className="text-muted">{location}</small>
      </Toast.Header>
        <Toast.Body>{message}</Toast.Body>
      </Toast>
  )
}
export { ConsoleContext, ConsoleProvider };