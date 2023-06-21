import React,{createContext} from "react";

const AuthContext = createContext({ isLoggedIn: false, role: undefined });

export default AuthContext;