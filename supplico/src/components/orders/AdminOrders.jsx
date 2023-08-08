import React, { useEffect, useState } from "react";
import axios from "axios";
import { SupplicoWebAPI_URL } from "../../utils/settings";
import CustomModal from "../layout/CustomModal";
import { Keys, getItem } from "../../utils/storage";
import Loading from "../layout/Loading";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [originalOrders, setOriginalOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(false);
  const [search, setSearch] = useState("");

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
      .get(SupplicoWebAPI_URL + "/orders", options)
      .then((res) => {
        if (res.data) {
          setOrders(res.data);
          setOriginalOrders(res.data);
          setLoading(false);
        } else alert("empty response.data");
      })
      .catch((err) => {
        setErrorMessage(err.message + ", " + err.response.data);
      });
  }

  if (!loading) {
    return (
      <>
        <div className="text-center mt-5 mb-5 admin-title">
          <h1>Orders</h1>
          <h2>Showing All Orders</h2>
          <label className="mb-2">
            <input type="checkbox" onChange={handleFilter} />
            Only Completed Orders
          </label>
          <br />
          <input
            type="text"
            name="search bar"
            placeholder="search transaction"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="table text-center admin-table">
            <thead>
              <tr>
                <th>Id</th>
                <th>Transaction Id</th>
                <th>Sum</th>
                <th>Quantity</th>
                <th>Pallets</th>
                <th>Supplier Id</th>
                <th>Supplier</th>
                <th>Driver Id</th>
                <th>Driver</th>
                <th>Business Id</th>
                <th>Business</th>
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
                  <td>{o.supplierId}</td>
                  <td>{o.supplierConfirmation ? "Yes" : "No"}</td>
                  <td>{o.driverId}</td>
                  <td>{o.driverConfirmation ? "Yes" : "No"}</td>
                  <td>{o.businessId}</td>
                  <td>{o.businessConfirmation ? "Yes" : "No"}</td>
                  <td>{o.created}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
