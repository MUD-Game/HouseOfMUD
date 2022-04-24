import React from 'react'
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from 'src/hooks/useAuth';
import Busy from '../Busy/index';
import { useEffect } from 'react';

type RequireAuthProps = {
    children: JSX.Element
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
    let auth = useAuth();
    let location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [isAuthenticating, setIsAuthenticating] = React.useState(true);
    useEffect(() => {
        auth.isAuthenticated(() => {
            setIsAuthenticated(true);
            setIsAuthenticating(false);
        }, () => {
            console.log("0")
            setIsAuthenticated(false);
            setIsAuthenticating(false);
        });
      return () => {
        
      }
    }, [])
    
   
    if(isAuthenticating){
        return <Busy/>
    } else if (!isAuthenticated){
        console.log("kfj")
        return <Navigate to="/login" state={{ from: location }} replace />;
    }else{
        return children;
    }
    
   

}

export default RequireAuth;    