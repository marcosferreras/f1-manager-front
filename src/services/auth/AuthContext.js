import { createContext } from "react";

const AuthContext = createContext({
  authData: undefined,
  setAuthData: (auth) => {}
});

export default AuthContext;