/**
 * @module AuthContext
 * @description Context for the Global Authentication, handles register/login an checkup if the user is logged in.
 * @author Raphael Sack
 * @category React Context
 */

import React from 'react';
import { supervisor } from 'src/services/supervisor';
import Cookies from 'universal-cookie';

type AuthContextType = {
  requestResetPassword:(email: string, success: VoidFunction, error: (error: string) => void)=> void;
  changePassword: (token: string, password: string, success: VoidFunction, error: (error: string) => void) => void;
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
  let isAuthenticated = (success: VoidFunction, error: (error: string) => void) => {
    supervisor.authenticate({ user: user, password: token }, (data: any) => {
        let c = new Cookies();
        setUser(c.get('user'));
        success();
    }, (errRes) => error(errRes.error));
  }

  const requestResetPassword = (email: string, success: VoidFunction, error: (error: string) => void) => {
    supervisor.requestResetPassword(email, success, errRes => error(errRes.error));
  }

  const changePassword = (token: string, password: string, success: VoidFunction, error: (error: string) => void) => {
    supervisor.changePassword(token, password, success, (errRes) => error(errRes.error));
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
  let value = { user, token, login, logout, register, isAuthenticated, verifyEmail, deleteUser, changePassword, requestResetPassword };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export { AuthContext, AuthProvider };