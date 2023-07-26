import React from "react";
import { useParams } from "react-router-dom";

export default function DisplayOrder(){
    let {orderid} = useParams()
    return(
        <>
        <h1>Showing order of {orderid}</h1>
        </>
    )
}