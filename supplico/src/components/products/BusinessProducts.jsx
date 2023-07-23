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
        setErrorMessage(err.message);
      });
  }, []);

  if (!loading) {
    return (
      <>
        <div className="text-center text-black">
          <h1 className="">Available Suppliers:</h1>
          <h3 style={{ color: "red" }}>
            *Note that you can only order from one supplier at a time
          </h3>
        </div>
        <div className="d-flex mb-5 justify-content-center">
          {users.map((u) => (
            <Card style={{ width: "18rem" }} border="dark" key={u.userId}>
              <Card.Img src={u.imageData} />
              <Card.Body style={{ backgroundColor: "#dddddd" }}>
                <Card.Title style={{ textDecoration: "underline" }}>
                  Supplier Details
                </Card.Title>
                <Card.Text>
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
