import React, { useState, useContext } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { NavLink, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { SupplicoWebAPI_URL } from "../../utils/settings";
import axios from "axios";
import "../../styles/registration.css";

export default function Login() {
  let [loginrUserName, setLoginUserName] = useState("");
  let [loginPassword, setLoginPassword] = useState("");
  let [passwordType, setpasswordType] = useState("password");
  let [errorMessage, setErrorMessage] = useState("");
  let { isLoggedIn, login, logout } = useContext(AuthContext);
  let navigate = useNavigate();

  function showPassword() {
    if (passwordType == "password") {
      setpasswordType("text");
    } else setpasswordType("password");
  }

  function onLogin() {
    if (loginrUserName) {
      axios
        .post(SupplicoWebAPI_URL + "/users/login", {
          userName: loginrUserName,
          password: loginPassword,
        })
        .then((res) => {
          if (res.data) {
            console.log(res.data);
            login(res.data);
            navigate("/");
          } else throw Error("No respones.data");
        })
        .catch((err) => {
          setErrorMessage("Error while trying to login, " + err.message);
        });
    } else {
      setErrorMessage("Username is mandatory");
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
          {errorMessage ? (
            <div className="alert alert-danger">{errorMessage}</div>
          ) : (
            ""
          )}
          <Button
            variant="primary"
            type="button"
            className="registration-btn mb-2"
            onClick={onLogin}
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
