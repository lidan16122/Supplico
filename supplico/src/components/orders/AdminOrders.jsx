import React, { useEffect, useState } from "react";
import axios from "axios";
import { SupplicoWebAPI_URL } from "../../utils/settings";
import CustomModal from "../layout/CustomModal";
import { Keys, getItem } from "../../utils/storage";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders();
  }, []);

  function getOrders() {
    let options = {
      headers: {
        Authorization: `Bearer ${getItem(Keys.accessToken)}`,
      },
    };
    axios
      .get(SupplicoWebAPI_URL + "/orders",options)
      .then((res) => {
        if (res.data){
          setOrders(res.data);
          setLoading(false)
          console.log(res.data)
        } 
        else console.log("empty response.data");
      })
      .catch((err) => {
        setErrorMessage(err.message);
      });
  }

if(!loading){

  return (
    <>
      <div className="text-center mt-5 mb-5 admin-title">
        <h1>Orders</h1>
        <h2>Showing All Orders</h2>
      </div>

      <table className="table text-center admin-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Transaction Id</th>
            <th>Sum</th>
            <th>Quantity</th>
            <th>Pallets</th>
            <th>Supplier</th>
            <th>Driver</th>
            <th>Driver Id</th>
            <th>Supplier Id</th>
            <th>Business Id</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.orderId}>
              <td>{o.orderId}</td>
              <td>{o.transactionId}</td>
              <td>{o.sum}</td>
              <td>{o.quantity}</td>
              <td>{o.pallets}</td>
              <td>{o.supplierConfirmation ? "Yes" : "No"}</td>
              <td>{o.driverConfirmation ? "Yes" : "No"}</td>
              <td>{o.driverId}</td>
              <td>{o.supplierId}</td>
              <td>{o.businessId}</td>
              <td>{o.created}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
else{
  return (
    <>
      {errorMessage ? <CustomModal title="Error" body={errorMessage} defaultShow={true}  /> : ""}
      <h1 className="text-center">LOADING...</h1>
    </>
  );
}
}
