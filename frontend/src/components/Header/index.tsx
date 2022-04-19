import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'src/hooks/useAuth';
type HeaderProps = {}

const Header: React.FC<HeaderProps> = (props) => {
    const auth = useAuth();
    const navigate = useNavigate();
    return (
        <div>
            <button onClick={()=>{
                auth.logout(()=>{
                });
                navigate("/login");
                
            }}>Logout</button>
        </div>
    )
}

export default Header;    