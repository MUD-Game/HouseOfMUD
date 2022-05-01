import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useMudConsole } from 'src/hooks/useMudConsole';
import { supervisor } from 'src/services/supervisor';
import Cookies from 'universal-cookie';

type AuthContextType = {
  user: string;
  token: string;
  isAuthenticated: (success: VoidFunction, error: (error: string) => void) => void;
  login: (user: string, password: string, success: VoidFunction, error: (error: string) => void) => void;
  register: (email: string, user: string, password: string, success: VoidFunction, error: (error: string) => void) => void;
  logout: (success: VoidFunction, error: (error: string) => void) => void;
  verifyEmail: (token: string, success: VoidFunction, error: (error: string) => void) => void;
  deleteUser: (success: VoidFunction, error: (error: string) => void) => void;
}

let AuthContext = React.createContext<AuthContextType>({} as AuthContextType);

function AuthProvider({ children }: { children: React.ReactNode }) {
  let [user, setUser] = React.useState<string>("");
  let [token, setToken] = React.useState<string>('');
  const { t } = useTranslation();
  const navigate = useNavigate();
  const homosole = useMudConsole();
  let isAuthenticated = (success: VoidFunction, error: (error: string) => void) => {
    supervisor.authenticate({ user: user, password: token }, (data: any) => {
        let c = new Cookies();
        setUser(c.get('user'));
        success();
    }, (errRes) => error(errRes.error));
  }

  let login = (user: string, password: string, success: VoidFunction, error: (error: string) => void) => {
    supervisor.authenticate({ user, password }, (data: any) => {
        setUser(user);
        let c = new Cookies();
        setToken(c.get('authToken'));
        success();
    }, (data) => {
      error(data.error);
    });
  };

  let deleteUser = (success: VoidFunction, error: (error: string) => void) => {
    supervisor.deleteUser(success, errRes => error(errRes.error));
  }

  let logout = (success: VoidFunction, error: (error: string) => void) => {
    supervisor.userLogout(success, (errorRes) => error(errorRes.error));
  };

  let register = (email: string, newUser: string, password: string, success: VoidFunction, error: (error: string) => void) => {
    supervisor.register(email, newUser, password, success, (errRes) => error(errRes.error));
  }

  let verifyEmail = (token: string, success: VoidFunction, error: (error: string) => void) => {
    supervisor.verify(token, success, (errRes) => error(errRes.error));
  }
  let value = { user, token, login, logout, register, isAuthenticated, verifyEmail, deleteUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export { AuthContext, AuthProvider };