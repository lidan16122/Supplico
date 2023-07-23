import React, { useState, useContext } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { SupplicoWebAPI_URL } from "../../utils/settings";
import axios from "axios";
import "../../styles/registration.css";

export default function Login() {
  const [loginrUserName, setLoginUserName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [passwordType, setpasswordType] = useState("password");
  const [modalMsg, setModalMsg] = useState("");
  const [modalBtn, setModalBtn] = useState(<Button variant="primary" onClick={() => handleCloseError()}>Close</Button>);
  const [modalTitle, setModalTitle] = useState("");
  let { isLoggedIn, login, logout } = useContext(AuthContext);
  const [validated, setValidated] = useState(false);
  const [show, setShow] = useState(false);

  let navigate = useNavigate();
  const handleCloseError = () => setShow(false);

  function showPassword() {
    if (passwordType == "password") {
      setpasswordType("text");
    } else setpasswordType("password");
  }

  function onLogin(e) {
    const form = e.currentTarget;
    e.preventDefault();
    e.stopPropagation();
    console.log(form.checkValidity());
    setValidated(true);
    if (form.checkValidity() === true) {
      axios
        .post(SupplicoWebAPI_URL + "/users/login", {
          userName: loginrUserName,
          password: loginPassword,
        })
        .then((res) => {
          if (res.data) {
            console.log(res.data);
            setModalTitle("Welcome Back")
            setModalMsg(`Welcome back ${loginrUserName}, we wish you a great day`);
            setModalBtn("")
            setShow(true);
            setTimeout(() => {
              login(res.data);
              navigate("/");
            }, 3000);
          } else{
            setModalTitle("Error")
            setModalMsg("No response data");
            setShow(true)
          } 
        })
        .catch((err) => {
          setModalTitle("Error")
          setModalMsg("Incorrect username or password, " + err.message);
          setShow(true)
        });
    } else {
      setModalTitle("Error")
      setModalMsg("Please provide username and password");
      setShow(true)
    }
  }

  if (isLoggedIn) {
    return (
      <Button
        variant="primary"
        type="button"
        onClick={logout}
        className="mt-5 mb-5"
      >
        Logout
      </Button>
    );
  }

  return (
    <div className="primary-form-background">
      <Modal show={show} onHide={handleCloseError}>
        <Modal.Header>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalMsg}
        </Modal.Body>
        <Modal.Footer>{modalBtn ? modalBtn : Date()}</Modal.Footer>
        
      </Modal>

      <p style={{ visibility: "hidden" }}>2</p>

      <Form
        className="primary-form pb-5 pt-5"
        noValidate
        validated={validated}
        onSubmit={onLogin}
      >
        <h1 className="registration-title mb-4">Login</h1>
        <Form.Group controlId="formUsername">
          <Form.Label className="primary-label">Username:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={loginrUserName}
            onChange={(e) => setLoginUserName(e.target.value)}
            required
          />
          <Form.Control.Feedback type="invalid">
            please provide a username
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-2" controlId="formPassword">
          <Form.Label className="primary-label">Password:</Form.Label>
          <Form.Control
            type={passwordType}
            placeholder="Enter password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            required
          />
          <Form.Control.Feedback type="invalid">
            please provide a password
          </Form.Control.Feedback>
          <input type="checkbox" onClick={() => showPassword()} /> show password
        </Form.Group>
        {modalMsg && modalMsg != `Welcome back ${loginrUserName}, we wish you a great day` ? (
          <div className="alert alert-danger">{modalMsg}</div>
        ) : (
          ""
        )}
        <Button
          variant="primary"
          type="submut"
          className="primary-form-btn mb-2"
        >
          Login
        </Button>
        <br />
        <NavLink to="/register" className="not-registered">
          if your not registered click here
        </NavLink>
      </Form>
    </div>
  );
}
