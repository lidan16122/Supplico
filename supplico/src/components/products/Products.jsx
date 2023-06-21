import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import DriverProducts from "./DriverProducts";
import BusinessProducts from "./BusinessProducts";
import SupplierProducts from "./SupplierProducts";

function Products(){
    let {role} = useContext(AuthContext);

    if(role == "business"){
        return <BusinessProducts />
    }
    else if (role == "driver"){
        return <DriverProducts />
    }
    else
    return(<SupplierProducts />)
}

export default Products;