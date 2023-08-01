import React, { useState, useEffect, useContext } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import { SupplicoWebAPI_URL } from "../../utils/settings";
import { Keys, getItem } from "../../utils/storage";
import { useNavigate } from "react-router-dom";
import CustomModal from "../layout/CustomModal";
import AuthContext from "../context/AuthContext";
import Loading from "../layout/Loading";

export default function MyOrders() {
  const [orders, setOrders] = useState();
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  let navigate = useNavigate();
  let { roleID } = useContext(AuthContext);

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
      .get(SupplicoWebAPI_URL + "/orders/" + getItem(Keys.userId), options)
      .then((res) => {
        if (res.data) {
          setOrders(res.data);
          console.log(res.data);
          setLoading(false);
        } else console.log("empty response.data");
      })
      .catch((err) => {
        setErrorMessage(err.message + ", " + err.response.data);
        if (err.response.data == "User has no orders") {
          setLoading(false);
        }
      });
  }

  if (!loading) {
    return (
      <>
        <div className="orders-background">
          <div className="text-center text-white pt-5 mb-5">
            <h1 className="components-title">
              Orders Of:
              <b style={{ color: "#ff851b" }}> {getItem(Keys.fullName)}</b>
            </h1>
            <h3 className="mb-4">Here are all of your orders:</h3>
            {roleID == 2 ? <Button variant="outline-light"  onClick={() => navigate("/orders/jobs")} className="driver-jobs">Available Jobs</Button> : ""}
          </div>
          <table className="table orders-table">
            <thead>
              <tr>
                <th>Transaction Id</th>
                <th>Sum</th>
                <th>Quantity</th>
                <th>Pallets</th>
                <th>Supplier</th>
                <th>Driver</th>
                <th>Business</th>
                <th>Driver Name</th>
                <th>Supplier Name</th>
                <th>Business Name</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {orders ? (
                orders.map((o) => (
                  <tr
                    key={o.orderId}
                    className="my-order-tr"
                    onClick={() => navigate(`/orders/${o.orderId}`)}
                  >
                    <td>{o.transactionId}</td>
                    <td>{o.sum}</td>
                    <td>{o.quantity}</td>
                    <td>{o.pallets}</td>
                    <td>{o.supplierConfirmation ? "Yes" : "No"}</td>
                    <td>{o.driverConfirmation ? "Yes" : "No"}</td>
                    <td>{o.businessConfirmation ? "Yes" : "No"}</td>
                    <td>{o.driverFullName}</td>
                    <td>{o.supplierFullName}</td>
                    <td>{o.businessFullName}</td>
                    <td>{o.created?.slice(0,10) || ""}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              )}
            </tbody>
          </table>
          <p className="share-info text-white">
            *Please do not share this information
          </p>
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
        <Loading />
      </>
    );
  }
}
