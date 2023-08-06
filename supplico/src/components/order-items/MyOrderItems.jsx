import React, { useEffect, useState, useContext } from "react";
import CustomModal from "../layout/CustomModal";
import { SupplicoWebAPI_URL } from "../../utils/settings";
import axios from "axios";
import { Keys, getItem } from "../../utils/storage";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import Loading from "../layout/Loading";

export default function MyOrderItems() {
  const [orderItems, setOrderItems] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  let { roleID } = useContext(AuthContext);
  let navigate = useNavigate();

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
      .get(SupplicoWebAPI_URL + `/orderItems/${getItem(Keys.userId)}`, options)
      .then((res) => {
        if (res.data) {
          setOrderItems(res.data);
          setLoading(false);
        } else alert("empty response.data");
      })
      .catch((err) => {
        setErrorMessage(err.message + ", " + err.response.data);
        if (err.response.data == "User has no items ordered") setLoading(false);
      });
  }

  function itemsOrderText(){
    if (roleID == 1) return "Showing All Items You Have Been Ordered";
    else if (roleID == 2) return "Showing Items That You Have Been Delivered"
    else return "Showing Items From Orders That Have Been Ordered From You"
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
      <div className="order-items-background">
        <div className="text-center text-black pt-5 mb-5">
          <h1 className="components-title">Items Ordered</h1>
          <h3 className="mb-4">{itemsOrderText()}</h3>
          {roleID == 2 ? <Button variant="dark"  onClick={() => navigate("/orders/jobs")} className="driver-jobs mb-2">Available Jobs</Button>  : ""}
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

        <table className="table order-items-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Transaction Id</th>
            </tr>
          </thead>
          <tbody>
            {orderItems ? (
              orderItems.map((o) => (
                <tr key={o.id}>
                  <td>{o.productName}</td>
                  <td>{o.quantity}</td>
                  <td>{o.transaction}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            )}
          </tbody>
        </table>
        <p className="share-info text-black">
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
