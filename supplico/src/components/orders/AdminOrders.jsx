import React, { useEffect, useState } from "react";
import axios from "axios";
import { SupplicoWebAPI_URL } from "../../utils/settings";
import { Button, Modal } from "react-bootstrap";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [show, setShow] = useState();

  const handleClose = () => setShow(false);

  useEffect(() => {
    getOrders();
  }, []);

  function getOrders() {
    axios
      .get(SupplicoWebAPI_URL + "/orders")
      .then((res) => {
        if (res.data){
          setOrders(res.data);
          console.log(res.data)
        } 
        else console.log("empty response.data");
      })
      .catch((err) => {
        setShow(true);
        setErrorMessage(err.response.data);
      });
  }


  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="text-center mt-5 mb-5 admin-title">
        <h1>Orders</h1>
        
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
