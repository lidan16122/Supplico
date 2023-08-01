import React, { useState, useEffect, useContext } from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { SupplicoWebAPI_URL } from "../../utils/settings";
import CustomModal from "../layout/CustomModal";
import AuthContext from "../context/AuthContext";
import Loading from "../layout/Loading";

function BusinessProducts() {
  const [users, setUsers] = useState();
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  let { roleID } = useContext(AuthContext);
  let navigate = useNavigate();


  useEffect(() => {
    axios
      .get(SupplicoWebAPI_URL + "/users/suppliers")
      .then((res) => {
        if (res.data) {
          setUsers(res.data);
          console.log(res.data);
          setLoading(false);
        } else setErrorMessage("empty response.data");
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
            <h1 className="components-title">Available Suppliers: {users.length}</h1>
            <h3 className="mb-4 red-note">
              *Note that you can only order from one supplier at a time
            </h3>
            {roleID == 2 ? <Button variant="dark" onClick={() => navigate("/orders/jobs")} className="driver-jobs">Available Jobs</Button> : ""}
          </div>
          <div className="container">
          <div className="row justify-content-around" style={{marginBottom: "200px"}}>
            {users.map((u) => (
              <Card className="suppliers-card col-3" border="dark" key={u.userId}>
                <Card.Img src={u.imageData} />
                <Card.Body>
                  <Card.Title>
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
                  <Button varient="primary" className="to-shop" onClick={() => navigate(`/products/${u.userId}`)}>
                      To Shop
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
        <Loading />
      </>
    );
  }
}

export default BusinessProducts;
