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
  const [originalOrders, setOriginalOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(false);
  const [search, setSearch] = useState("");
  let navigate = useNavigate();
  let { roleID } = useContext(AuthContext);

  const handleFilter = () => {
    if (!filter) {
      setFilter(true);
      setOrders(
        originalOrders.filter(
          (o) =>
            o.businessConfirmation &&
            o.driverConfirmation &&
            o.supplierConfirmation
        )
      );
    } else {
      setFilter(false);
      if (!search) {
        setOrders(originalOrders);
      } else {
        setOrders(
          originalOrders.filter((o) =>
            o.transactionId.toLowerCase().includes(search.toLowerCase())
          )
        );
      }
    }
  };

  function handleSearch() {
    if (!search) {
      if (!filter) {
        setOrders(originalOrders);
      } else {
        setOrders(
          originalOrders.filter(
            (o) =>
              o.businessConfirmation &&
              o.driverConfirmation &&
              o.supplierConfirmation
          )
        );
      }
    } else {
      if (filter) {
        setOrders(
          originalOrders.filter(
            (o) =>
              o.transactionId.toLowerCase().includes(search.toLowerCase()) &&
              o.businessConfirmation &&
              o.driverConfirmation &&
              o.supplierConfirmation
          )
        );
      } else {
        setOrders(
          originalOrders.filter((o) =>
            o.transactionId.toLowerCase().includes(search.toLowerCase())
          )
        );
      }
    }
  }

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
          setOriginalOrders(res.data);
          setLoading(false);
        } else alert("empty response.data");
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
          <div className="text-center text-white pt-5 mb-5 components">
            <h1 className="components-title">
              Orders Of:
              <b style={{ color: "#ff851b" }}> {getItem(Keys.fullName)}</b>
            </h1>
            <h3 className="mb-4">Here are all of your orders:</h3>
            <label className="mb-2">
              <input type="checkbox" onChange={handleFilter} />
              Show Completed Orders
            </label>
            <br />
            {roleID == 2 ? (
              <Button
                variant="dark"
                onClick={() => navigate("/orders/jobs")}
                className="driver-jobs mb-2"
              >
                Available Jobs
              </Button>
            ) : (
              ""
            )}
            <br />
            <input
              className={roleID == 2 ? "mb-2" : ""}
              type="text"
              name="search bar"
              placeholder="search transaction"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="table orders-table">
              <thead>
                <tr>
                  <th>Transaction Id</th>
                  <th>Sum</th>
                  <th>Quantity</th>
                  <th>Pallets</th>
                  <th>Driver</th>
                  <th>Supplier</th>
                  <th>Business Name</th>
                  <th>Driver Name</th>
                  <th>Supplier Name</th>
                  <th>Created</th>
                  <th>Status</th>
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
                      <td>{o.driverConfirmation ? "Accepted" : "Searching"}</td>
                      <td>{o.supplierConfirmation ? "Accepted" : "Waiting"}</td>
                      <td>{o.businessFullName}</td>
                      <td>{o.driverFullName}</td>
                      <td>{o.supplierFullName}</td>
                      <td>{o.created?.slice(0, 10) || ""}</td>
                      <td>
                        {o.businessConfirmation ? "Completed" : "Waiting"}
                      </td>
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
          </div>
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
