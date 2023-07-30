import React, { useState, useEffect, useContext } from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { SupplicoWebAPI_URL } from "../../utils/settings";
import CustomModal from "../layout/CustomModal";
import AuthContext from "../context/AuthContext";

export default function DriverOrders() {
  const [orders, setOrders] = useState();
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  let { roleID } = useContext(AuthContext);
  let navigate = useNavigate();


  useEffect(() => {
    axios
      .get(SupplicoWebAPI_URL + "/orders/drivers")
      .then((res) => {
        if (res.data) {
          setOrders(res.data);
          console.log(res.data);
          setLoading(false);
        } else setErrorMessage("empty response.data");
      })
      .catch((err) => {
        setErrorMessage(err.message + ", " + err.response.data);
      });
  }, []);

  if (!loading && roleID == 2) {
    return (
      <>
        <div className="drivers-background">
          <div className="text-center text-black pt-5 pb-5">
            <h1 className="components-title">Available Orders: {orders.length}</h1>
            <h3 className="mb-4 red-note">
              *Please select a order that is relevant for you, so you complete that job
            </h3>
          </div>
          <div className="container">
          <div className="row justify-content-around" style={{marginBottom: "200px"}}>
            {orders.map((o) => (
              <Card className="drivers-card col-3" border="dark" key={o.orderId}>
                <Card.Body>
                  <Card.Title>
                    Order Details
                  </Card.Title>
                  <Card.Text>
                    <b>Business Name: </b>
                    {o.businessFullName}
                    <br />
                    <b>Supplier Name: </b>
                    {o.supplierFullName}
                    <br />
                    <b>Sum: </b>
                    {o.sum}
                    <br />
                    <b>Quantity: </b>
                    {o.quantity}
                    <br />
                    <b>Pallets: </b>
                    {o.pallents ? o.pallents : 0}
                    <br />
                    <b>Date: </b>
                    {o.created.slice(0,10)}
                  </Card.Text>
                  <Button varient="primary" className="to-shop" onClick={() => navigate(`/orders/${o.orderId}`)}>
                    To Order
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </div>
          </div>
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

