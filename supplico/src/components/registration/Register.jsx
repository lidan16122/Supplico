import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Col, Row, Modal } from "react-bootstrap";
import axios from "axios";
import { SupplicoWebAPI_URL } from "../../utils/settings";
import AuthContext from "../context/AuthContext";

export default function Register() {
  const [registerRole, setRegisterRole] = useState(1);
  const [registerImage, setRegisterImage] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerUserName, setRegisterUserName] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [passwordType, setpasswordType] = useState("password");
  const [userNameValidation, setUserNameValidation] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState(false);
  const [emailValidation, setEmailValidation] = useState(false);
  const [phoneValidation, setPhoneValidation] = useState(false);
  const [nameValidation, setNameValidation] = useState(false);
  const [imageValidation, setImageValidation] = useState(false);
  const [showError, setShowError] = useState(false);
  const [modalTitle, setModalTitle] = useState("Error");
  const [modalBody, setModalBody] = useState("");
  const [modalBtn, setModalBtn] = useState(
    <Button variant="primary" onClick={handleCloseError}>
      Close
    </Button>
  );
  let { isLoggedIn, logout } = useContext(AuthContext);

  function handleCloseError() {
    setShowError(false);
  }

  function showPassword() {
    if (passwordType == "password") {
      setpasswordType("text");
    } else setpasswordType("password");
  }

  function ImageText() {
    if (registerRole == 1) return "business";
    else if (registerRole == 2) return "driving";
    else return "import and export";
  }

  async function OnRegister(e) {
    const form = e.currentTarget;
    e.preventDefault();
    e.stopPropagation();
    setUserNameValidation(true);
    setPasswordValidation(true);
    setEmailValidation(true);
    setPhoneValidation(true);
    setNameValidation(true);
    setImageValidation(true);
    if (
      form.checkValidity() === true &&
      registerUserName.length > 5 &&
      registerUserName.length < 17 &&
      registerPassword.length > 7 &&
      registerPassword.length < 25
    ) {
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
        setShowError(true);
        setModalTitle("Saved");
        setModalBody("your details are saved, please wait for admin approval");
        setModalBtn(
          <NavLink
            className="btn btn-primary"
            to="/"
            onClick={handleCloseError}
          >
            Close
          </NavLink>
        );
      } catch (err) {
        setShowError(true);
        setModalBody(err.response.data + ", " + err.message);
      }
    } else {
      setShowError(true);
      setModalBody(
        "an error is been occurred with the data inputed, please check your details"
      );
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
      <Modal show={showError} onHide={handleCloseError}>
        <Modal.Header>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalBody}</Modal.Body>
        <Modal.Footer>{modalBtn}</Modal.Footer>
      </Modal>

      <p style={{ visibility: "hidden" }}>2</p>

      <Form
        onSubmit={OnRegister}
        className="primary-form"
        encType="multipart/form-data"
        method="post"
        noValidate
      >
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
            isInvalid={!imageValidation || !registerImage}
          />
        </Form.Group>

        <Row>
          <Form.Group as={Col} controlId="formName">
            <Form.Label className="primary-label">
              {registerRole == 2 ? "Full Name" : "Business Name"}
            </Form.Label>
            <Form.Control
              type="text"
              placeholder={registerRole == 2 ? "Full Name" : "Business Name"}
              value={registerName}
              onChange={(e) => setRegisterName(e.target.value)}
              isInvalid={!(registerName.length > 1) && nameValidation}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid name
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group as={Col} controlId="formPhonenumber">
            <Form.Label className="primary-label">Phone number</Form.Label>
            <Form.Control
              type="tel"
              placeholder="Phone number"
              value={registerPhone}
              onChange={(e) => setRegisterPhone(e.target.value)}
              isInvalid={!registerPhone.length && phoneValidation}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid number
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Form.Group controlId="formEmail">
          <Form.Label className="primary-label">Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Email"
            value={registerEmail}
            onChange={(e) => setRegisterEmail(e.target.value)}
            isInvalid={
              (!registerEmail.includes("@") && emailValidation) ||
              !registerEmail.substring(0, registerEmail.indexOf("@")) ||
              !registerEmail.split("@")[1]
            }
            required
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid email
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formUsername">
          <Form.Label className="primary-label">Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Username"
            value={registerUserName}
            onChange={(e) => setRegisterUserName(e.target.value)}
            isInvalid={
              !(registerUserName.length > 5 && registerUserName.length < 17) &&
              userNameValidation
            }
            required
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid username between 6-16 characters
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label className="primary-label">Password</Form.Label>
          <Form.Control
            type={passwordType}
            placeholder="Password"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
            isInvalid={
              !(registerPassword.length > 7) || !(registerPassword.length < 25) &&
              passwordValidation
            }
            required
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid password between 8-24 characters
          </Form.Control.Feedback>
          <input type="checkbox" onClick={() => showPassword()} /> show password
        </Form.Group>
        <p className="red-note">
          <b>*Note that a admin will be examine your user application*</b>
        </p>
        <Button
          variant="primary"
          type="submit"
          className="primary-form-btn mb-2"
        >
          Register
        </Button>
      </Form>
    </div>
  );
}
