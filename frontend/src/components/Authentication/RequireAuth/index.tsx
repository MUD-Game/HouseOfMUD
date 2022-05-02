/**
 * @module RequireAuth
 * @description Wrapper around a or more components that require Authentication to Show, it checks wheter the user is logged in or not and shows the childrens or not.
 * @category React Component
 * @author Raphael Sack
 * @param {React.ReactNode} children Children of the component
 */

import React from 'react'
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from 'src/hooks/useAuth';
import Busy from '../../Busy/index';
import { useEffect } from 'react';

type RequireAuthProps = {
    children: JSX.Element
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
    let auth = useAuth();
    let location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
    useEffect(() => {
        auth.isAuthenticated(() => {
            setIsAuthenticated(true);
            setIsLoading(false);
        }, () => {
            setIsAuthenticated(false);
            setIsLoading(false);
        });
      return () => {
        
      }
    }, [])
    
   
    if(isLoading){
        return <Busy/>
    } else if (!isAuthenticated){
        return <Navigate to="/login" state={{ from: location }} replace />;
    }else{
        return children;
    }
    
   

}

export default RequireAuth;    