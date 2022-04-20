import React from 'react';

type AuthContextType = {
  user: any;
  token: string;
  isAuthenticated: () => Promise<boolean>;
  login: (user: string, password: string, success: VoidFunction, error: VoidFunction) => void;
  register: (user: string, password: string, success: VoidFunction, error: VoidFunction) => void;
  logout: (callback: VoidFunction) => void;
}

let AuthContext = React.createContext<AuthContextType>({} as AuthContextType);

function AuthProvider({ children }: { children: React.ReactNode }) {
  let [user, setUser] = React.useState<any>("DummyUser");
  let [token, setToken] = React.useState<string>('xxx');
  let isAuthenticated = async () => {
    return true;
  }

  let login = (user: string, password: string, success: VoidFunction,error:(error: string) => void) => {
    
  };

  let logout = (callback: VoidFunction) => {
    
  };

  let register = (newUser: string, password: string, success: VoidFunction, error: VoidFunction) => {
    
  }
  let value = { user, token, login, logout, register, isAuthenticated };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export { AuthContext, AuthProvider };