import React,{createContext} from "react";

const AuthContext = createContext({ isLoggedIn: false, roleID: 0 ,userName: null, login:()=>{}, logout:()=>{}});

export default AuthContext;