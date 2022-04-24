import React from 'react';
import { useMudConsole } from 'src/hooks/useMudConsole';
import { supervisor } from 'src/services/supervisor';

type AuthContextType = {
  user: string;
  token: string;
  isAuthenticated: () => Promise<boolean>;
  login: (user: string, password: string, success: VoidFunction, error: VoidFunction) => void;
  register: (user: string, password: string, success: VoidFunction, error: VoidFunction) => void;
  logout: (callback: VoidFunction) => void;
}

let AuthContext = React.createContext<AuthContextType>({} as AuthContextType);

function AuthProvider({ children }: { children: React.ReactNode }) {
  let [user, setUser] = React.useState<string>("DummyUser");
  let [token, setToken] = React.useState<string>('xxx');
  const homosole = useMudConsole();
  let isAuthenticated = async () => {
    supervisor.authenticate({user:"mockuser", password:"mockpassword"}, ()=>{
      // console.log("authenticated");
    }, homosole.supervisorerror)
    return true;
  }

  let login = (user: string, password: string, success: VoidFunction, error: (error: string) => void) => {

  };

  let logout = (callback: VoidFunction) => {

  };

  let register = (newUser: string, password: string, success: VoidFunction, error: VoidFunction) => {

  }
  let value = { user, token, login, logout, register, isAuthenticated };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export { AuthContext, AuthProvider };