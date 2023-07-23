import React, {useContext} from "react";
import AuthContext from "../context/AuthContext";
import BusinessOrders from "./BusinessOrders";
import DriverOrders from "./DriverOrders";
import SupplierOrders from "./SupplierOrders";
import AdminOrders from "./AdminOrders";
import MyOrders from "./MyOrders";


export default function Orders(){
    let { roleID } = useContext(AuthContext);

     if(roleID==4) return <AdminOrders />
    else return <MyOrders />
 }