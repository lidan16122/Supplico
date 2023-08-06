import React, { useState, useEffect } from "react";
import { Card} from "react-bootstrap";
import axios from "axios";
import { SupplicoWebAPI_URL } from "../../utils/settings";
import { Keys, getItem } from "../../utils/storage";
import "../../styles/components.css";
import CustomModal from "../layout/CustomModal";
import Loading from "../layout/Loading";

export default function MyProfile() {
  const [user, setUser] = useState();
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(SupplicoWebAPI_URL + "/users/" + getItem(Keys.userId))
      .then((res) => {
        if (res.data) {
          setUser(res.data);
          setLoading(false);
        } else alert("empty response.data");
      })
      .catch((err) => {
        setShow(true);
        setErrorMessage(err.response.data + ", " + err.message);
      });
  }, []);

  if (!loading) {
    return (
      <>
        <div className="my-profile-background">
          <div className="text-center text-black pt-5">
            <h1 className="components-title">
              The Profile Of: <b style={{color:"#ff851b"}}>{user.fullName}</b>
            </h1>
            <h3>Here you can view your profile card</h3>
          </div>
          <Card className="my-profile-card" border="warning">
            <Card.Img src={user.imageData} />
            <Card.Body>
              <Card.Title>User Details</Card.Title>
              <Card.Text>
                <p>
                  <b>Username: </b>
                  {user.userName}
                </p>
                <p>
                  <b>Name: </b>
                  {user.fullName}
                </p>
                <p>
                  <b>Email: </b>
                  {user.email}
                </p>
                <p>
                  <b>Phonenumber: </b>
                  {user.phoneNumber}
                </p>
                <p>
                  <b>Role: </b>
                  {user.roleName}
                </p>
              </Card.Text>
            </Card.Body>
          </Card>
          <p className="share-info">*Please do not share this information</p>
        </div>
      </>
    );
  } else {
    return (
      <>
      {errorMessage ? <CustomModal title="Error" body={errorMessage} defaultShow={true}  /> : ""}
        <Loading />
      </>
    );
  }
}
