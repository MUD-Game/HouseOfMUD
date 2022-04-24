import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMudConsole } from 'src/hooks/useMudConsole';
import { supervisor } from 'src/services/supervisor';
import Cookies from 'universal-cookie';

type AuthContextType = {
  user: string;
  token: string;
  isAuthenticated: (success: VoidFunction, error: VoidFunction) => void;
  login: (user: string, password: string, success: VoidFunction, error: VoidFunction) => void;
  register: (user: string, password: string, success: VoidFunction, error: VoidFunction) => void;
  logout: (callback: VoidFunction) => void;
}

let AuthContext = React.createContext<AuthContextType>({} as AuthContextType);

function AuthProvider({ children }: { children: React.ReactNode }) {
  let [user, setUser] = React.useState<string>("");
  let [token, setToken] = React.useState<string>('');
  const navigate = useNavigate();
  const homosole = useMudConsole();
  let isAuthenticated = (success:VoidFunction, error:VoidFunction) => {
    supervisor.authenticate({ user: user, password: token }, (data:any)=>{
        if(data.ok){
          success();
        }else{
          error();
        }
    }, error)
  }

  let login = (user: string, password: string, success: VoidFunction, error: (error: string) => void) => {
    supervisor.authenticate({ user, password }, (data: any) => {
      console.log(data);
      if (data.ok) {
        setUser(user);
        let c = new Cookies();
        setToken(c.get('authToken'));
        success();
      } else {
        homosole.supervisorerror(data.error);
      }
    }, homosole.supervisorerror)
  };

  let logout = (callback: VoidFunction) => {
    setUser("");
    setToken("");
    let c = new Cookies();
    c.remove("user"); 
    c.remove("token");
    callback();
  };

  let register = (newUser: string, password: string, success: VoidFunction, error: VoidFunction) => {

  }
  let value = { user, token, login, logout, register, isAuthenticated };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export { AuthContext, AuthProvider };