import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { SupplicoWebAPI_URL } from "../../utils/settings";
import CustomModal from "../layout/CustomModal";

function BusinessProducts() {
  const [users, setUsers] = useState();
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(SupplicoWebAPI_URL + "/users/suppliers")
      .then((res) => {
        if (res.data) {
          setUsers(res.data);
          console.log(res.data);
          setLoading(false);
        } else console.log("empty response.data");
      })
      .catch((err) => {
        setErrorMessage(err.message + ", " + err.response.data);
      });
  }, []);

  if (!loading) {
    return (
      <>
        <div className="suppliers-background">
          <div className="text-center text-black pt-5 pb-5">
            <h1 style={{fontSize: "50px"}}>Available Suppliers: {users.length}</h1>
            <h3 style={{ color: "red" }}>
              *Note that you can only order from one supplier at a time
            </h3>
          </div>
          <div className="d-flex mb-5 justify-content-around">
            {users.map((u) => (
              <Card style={{ width: "22rem" }} border="dark" key={u.userId}>
                <Card.Img src={u.imageData} style={{height: "12em"}} />
                <Card.Body style={{ backgroundColor: "#dddddd" }}>
                  <Card.Title style={{ textDecoration: "underline", fontSize:"28px" }}>
                    Supplier Details
                  </Card.Title>
                  <Card.Text style={{fontSize:"20px"}}>
                    <b>Name: </b>
                    {u.fullName}
                    <br />
                    <b>Email: </b>
                    {u.email}
                    <br />
                    <b>Phonenumber: </b>
                    {u.phoneNumber}
                    <br />
                  </Card.Text>
                  <Button varient="primary" className="to-shop">
                    <NavLink to={`/products/${u.userId}`} className="link-none">
                      To Shop
                    </NavLink>
                  </Button>
                </Card.Body>
              </Card>
            ))}
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

export default BusinessProducts;
