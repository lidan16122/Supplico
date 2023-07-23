import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import { SupplicoWebAPI_URL } from "../../utils/settings";
import { Keys, getItem } from "../../utils/storage";
import { NavLink } from "react-router-dom";
import CustomModal from "../layout/CustomModal";

export default function MyOrders() {
  const [orders, setOrders] = useState();
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders();
  }, []);

  function getOrders() {
    axios
      .get(SupplicoWebAPI_URL + "/orders/" + getItem(Keys.userId))
      .then((res) => {
        if (res.data) {
          setOrders(res.data);
          console.log(res.data);
          setLoading(false);
        } else console.log("empty response.data");
      })
      .catch((err) => {
        setErrorMessage(err.message + ", "+ err.response.data);
      });
  }

  
  if (!loading) {
    return (
      <>
        <div className="products-background">
          <div className="text-center text-black pt-5 mb-5">
            <h1>
              Orders Of:{" "}
              <b style={{ color: "#ff851b" }}>{getItem(Keys.fullName)}</b>
            </h1>
            <h3>Here are all of your orders:</h3>
          </div>
          <table className="table products-table">
          <thead>
          <tr>
            <th>Transaction Id</th>
            <th>Sum</th>
            <th>Quantity</th>
            <th>Pallets</th>
            <th>Supplier</th>
            <th>Driver</th>
            <th>Driver Name</th>
            <th>Supplier Name</th>
            <th>Business Name</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.orderId}>
              <td>{o.transactionId}</td>
              <td>{o.sum}</td>
              <td>{o.quantity}</td>
              <td>{o.pallets}</td>
              <td>{o.supplierConfirmation ? "Yes" : "No"}</td>
              <td>{o.driverConfirmation ? "Yes" : "No"}</td>
              <td>{o.driverFullName}</td>
              <td>{o.supplierFullName}</td>
              <td>{o.businessFullName}</td>
              <td>{o.created}</td>
            </tr>
          ))}
        </tbody>
          </table>
          <p className="share-info">*Please do not share this information</p>
        </div>
      </>
    );
  } else {
    return (
      <>
        {errorMessage ? (
          <CustomModal title="Error" body={errorMessage} defaultShow={true} />
        ) : (
          ""
        )}
        <h1 className="text-center">LOADING...</h1>
      </>
    );
  }
}
