import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
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
        setErrorMessage(err.messsage);
      });
  }, []);

  if(!loading){
      return (
        <>

          <h1 className="text-center">Suppliers</h1>
          <div className="container">
            {users.map((u) => (
              <Card style={{ width: "18rem" }} border="warning" key={u.userId}>
                <Card.Img src={u.imageData} />
                <Card.Body>
                  <Card.Title>User Details</Card.Title>
                  <Card.Text>
                      <b>Username: </b>
                      {u.userName}
                    <br />
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
                  <NavLink to={`/products/${u.userId}`}>To Shop</NavLink>
                </Card.Body>
              </Card>
            ))}
          </div>
        </>
      );
  }
  else{
    return(
        <>
        <CustomModal title="Error" body={errorMessage} defaultShow={true}/>

        <h1 className="text-center">LOADING...</h1>
      </>
    )
  }
}

export default BusinessProducts;
