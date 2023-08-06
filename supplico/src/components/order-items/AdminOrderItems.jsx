import React, { useEffect, useState } from "react";
import CustomModal from "../layout/CustomModal";
import { SupplicoWebAPI_URL } from "../../utils/settings";
import axios from "axios";
import { Keys, getItem } from "../../utils/storage";
import Loading from "../layout/Loading";

export default function AdminOrderItems() {
  const [orderItems, setOrderItems] = useState([]);
  const [originalOrderItems, setOriginalOrderItems] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");


  useEffect(() => {
    getOrderItems();
  }, []);

  function getOrderItems() {
    let options = {
      headers: {
        Authorization: `Bearer ${getItem(Keys.accessToken)}`,
      },
    };
    axios
      .get(SupplicoWebAPI_URL + "/orderItems", options)
      .then((res) => {
        if (res.data) {
          setOrderItems(res.data);
          setOriginalOrderItems(res.data);
          setLoading(false);
        } else alert("empty response.data");
      })
      .catch((err) => {
        setErrorMessage(err.message + ", " + err.response.data);
      });
  }

  function handleSearch() {
    if (!search) {
      setOrderItems(originalOrderItems);
    } else {
      setOrderItems(
        originalOrderItems.filter((o) =>
          o.transaction.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }

  if (!loading) {
    return (
      <>
        <div className="text-center mt-5 mb-5 admin-title">
          <h1>Order Items</h1>
          <h2>Showing All Items In Orders</h2>
          <br />
          <input
            type="text"
            name="search bar"
            placeholder="search transaction"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={handleSearch}>
            Search
          </button>{" "}
        </div>

        <table className="table text-center admin-table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Product Id</th>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Order Id</th>
              <th>Transaction Id</th>
            </tr>
          </thead>
          <tbody>
            {orderItems.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.productId}</td>
                <td>{o.productName}</td>
                <td>{o.quantity}</td>
                <td>{o.orderId}</td>
                <td>{o.transaction}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
