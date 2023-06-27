import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import DriverProducts from "./DriverProducts";
import BusinessProducts from "./BusinessProducts";
import SupplierProducts from "./SupplierProducts";
import { useNavigate } from "react-router-dom";
import Login from "../registration/Login";

function Products(){
    let {roleID} = useContext(AuthContext);
    let navigate = useNavigate();

    if(roleID == 1)
        return <BusinessProducts />
    
    else if (roleID == 2)
        return <DriverProducts />
    
    else if (roleID == 3)
    return(<SupplierProducts />)
    else
        return(
            <h1>Something went wrong</h1>
        )
        
}

export default Products;