import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import AdminUsers from "./AdminUsers";
import MyProfile from "./MyProfile";


export default function Users(){
    let { roleID } = useContext(AuthContext);

    if (roleID == 4) return <AdminUsers />
    else return <MyProfile />
}