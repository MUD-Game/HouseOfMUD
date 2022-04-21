import React from 'react'
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from 'src/hooks/useAuth';

type RequireAuthProps = {
    children: JSX.Element
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
    let auth = useAuth();
    let location = useLocation();
    if (!auth.isAuthenticated()) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }



    return children;
}

export default RequireAuth;    