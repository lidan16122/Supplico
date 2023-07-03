import React, {useContext} from "react";
import AuthContext from "../context/AuthContext";
import BusinessOrders from "./BusinessOrders";
import DriverOrders from "./DriverOrders";
import SupplierOrders from "./SupplierOrders";
import AdminOrders from "./AdminOrders";


export default function Orders(){
    let { roleID } = useContext(AuthContext);

    if(roleID == 1 ) return <BusinessOrders />
    else if(roleID==2) return <DriverOrders />
    else if(roleID==3) return <SupplierOrders />
    else if(roleID==4) return <AdminOrders />
    else return <h1>Something went wrong</h1>
 }