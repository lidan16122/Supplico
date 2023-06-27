import React, { useState} from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { NavLink } from "react-router-dom";
import "../../styles/registration.css";

export default function Login() {
  let [loginrUserName, setLoginUserName] = useState("");
  let [loginPassword, setLoginPassword] = useState("");
  let [passwordType, setpasswordType] = useState("password");

  function showPassword() {
    if (passwordType == "password") {
      setpasswordType("text");
    } else setpasswordType("password");
  }

  return (
    <>
      <div className="registration">
        <p style={{ visibility: "hidden" }}>2</p>
        <Form className="registration-form pb-5 pt-5">
          <h1 className="registration-title mb-4">Login</h1>
          <Form.Group className="mb-3" controlId="formUsername">
            <Form.Label className="registration-label">Username:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={loginrUserName}
              onChange={(e) => setLoginUserName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label className="registration-label">Password:</Form.Label>
            <Form.Control
              type={passwordType}
              placeholder="Enter password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
            <input type="checkbox" onClick={() => showPassword()} /> show
            password
          </Form.Group>
          <Button
            variant="primary"
            type="button"
            className="registration-btn mb-2"
          >
            Login
          </Button>
          <br />
          <NavLink to="/register" className="not-registered">
            if your not registered click here
          </NavLink>
        </Form>
      </div>
    </>
  );
}
