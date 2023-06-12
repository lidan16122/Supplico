import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { NavLink } from "react-router-dom";
import "../../styles/registration.css";

export default function Login() {
  return (
    <>
      <div className="registration">
        <p style={{visibility:"hidden"}}>2</p>
        <Form className="registration-form">
          <h1 className="registration-title mb-4">Login</h1>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              type="text"
              placeholder="Enter user name"
              value={"enteredUserName"}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={"enteredPassword"}
            />
          </Form.Group>
          <Button variant="primary" type="button" className="registration-btn mb-2">
            Login
          </Button>
          <br />
            <NavLink to="/register" className="not-registered">if your not registered click here</NavLink>
        </Form>
      </div>
    </>
  );
}
