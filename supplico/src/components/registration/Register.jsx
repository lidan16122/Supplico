import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Col, Row } from "react-bootstrap";
import axios from "axios";
import { SupplicoWebAPI_URL } from "../../utils/settings";

export default function Register() {
  let [registerRole, setRegisterRole] = useState(1);
  let [registerImage, setRegisterImage] = useState("");
  let [registerName, setRegisterName] = useState("");
  let [registerPhone, setRegisterPhone] = useState("");
  let [registerEmail, setRegisterEmail] = useState("");
  let [registerUserName, setRegisterUserName] = useState("");
  let [registerPassword, setRegisterPassword] = useState("");
  let [passwordType, setpasswordType] = useState("password");
  let navigate = useNavigate();
  

  function showPassword(){
    if (passwordType == "password"){
      setpasswordType("text")
    }
    else
      setpasswordType("password")
  }

  function ImageText(){
    if (registerRole == 1) 
        return "business"
    else if (registerRole == 2)
        return "driving"
     else return "import and export"
  }

  async function OnRegister(e){
    e.preventDefault();
    if (registerUserName) {
      const formData = new FormData();
      formData.append("userName", registerUserName);
      formData.append("password", registerPassword);
      formData.append("fullName", registerName);
      formData.append("email", registerEmail);
      formData.append("phoneNumber", registerPhone);
      formData.append("roleId", registerRole);
      formData.append("image", registerImage);
      try {
        const response = await axios({
          method: "post",
          url: `${SupplicoWebAPI_URL}/users/register`,
          data: formData,
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Saved");
        navigate("/");
      } catch (error) {
        alert(error);
      }
    } else {
      alert("Name and price data are mandatory");
    }
  }

  return (
    <div className="registration">
      <p style={{ visibility: "hidden" }}>2</p>
      <Form onSubmit={OnRegister} className="registration-form" encType="multipart/form-data" method="post">
        <h1 className="registration-title">Register</h1>
        <h3 className="mb-2">What is your role?</h3>

        <Form.Select
          className="mb-2"
          value={registerRole}
          onChange={(e) => setRegisterRole(e.target.value)}
          required
        >
          <option value={1}>Business</option>
          <option value={2}>Driver</option>
          <option value={3}>Supplier</option>
        </Form.Select>

        <Form.Group controlId="formFile" className="mb-2">
          <Form.Label className="register-image-text">
            Please upload a valid {ImageText()} license
          </Form.Label>
          <Form.Control
            required
            type="file"
            onChange={(e) => setRegisterImage(e.target.files[0])}
          />
        </Form.Group>

        <Row>
          <Form.Group as={Col} className="mb-2" controlId="formName">
            <Form.Label className="registration-label">Full name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Full name"
              value={registerName}
              onChange={(e) => setRegisterName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group as={Col} className="mb-2" controlId="formPhonenumber">
            <Form.Label className="registration-label">Phone number</Form.Label>
            <Form.Control
              type="tel"
              placeholder="Phone number"
              value={registerPhone}
              onChange={(e) => setRegisterPhone(e.target.value)}
              required
            />
          </Form.Group>
        </Row>

        <Form.Group className="mb-2" controlId="formEmail">
          <Form.Label className="registration-label">Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Email"
            value={registerEmail}
            onChange={(e) => setRegisterEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-2" controlId="formUsername">
          <Form.Label className="registration-label">Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Username"
            value={registerUserName}
            onChange={(e) => setRegisterUserName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label className="registration-label">Password</Form.Label>
          <Form.Control
            type={passwordType}
            placeholder="Password"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
            required
          />
          <input type="checkbox" onClick={() => showPassword()}/> show password
        </Form.Group>
        <p style={{ color: "red", fontWeight: "bold" }}>
          *Note that a admin will be examine your user application*
        </p>
        <Button
          variant="primary"
          type="submit"
          className="registration-btn mb-2"
        >
          Register
        </Button>
      </Form>
    </div>
  );
}
