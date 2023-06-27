import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Col, Row } from "react-bootstrap";

export default function Register() {
  let [registerRole, setRegisterRole] = useState(1);
  let [registerImage, setRegisterImage] = useState("");
  let [registerName, setRegisterName] = useState("");
  let [registerPhone, setRegisterPhone] = useState("");
  let [registerEmail, setRegisterEmail] = useState("");
  let [registerUserName, setRegisterUserName] = useState("");
  let [registerPassword, setRegisterPassword] = useState("");
  let [passwordType, setpasswordType] = useState("password");
  

  function imageText() {
    if (registerRole == 1) {
      return "business";
    } else if (registerRole == 2) {
      return "driver";
    } else {
      return "export and import";
    }
  }

  function showPassword(){
    if (passwordType == "password"){
      setpasswordType("text")
    }
    else
      setpasswordType("password")
  }

  return (
    <div className="registration">
      <p style={{ visibility: "hidden" }}>2</p>
      <Form className="registration-form">
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
            Please upload a valid {imageText()} license
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
          type="button"
          className="registration-btn mb-2"
        >
          Register
        </Button>
      </Form>
    </div>
  );
}
