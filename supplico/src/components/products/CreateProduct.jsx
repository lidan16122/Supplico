import axios from "axios";
import React, { useState } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import { SupplicoWebAPI_URL } from "../../utils/settings";
import { Keys, getItem } from "../../utils/storage";
import { NavLink } from "react-router-dom";

export default function CreateProduct() {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState(0);
  const [nameValidation, setNameValidation] = useState(false);
  const [priceValidation, setPriceValidation] = useState(false);
  const [show, setShow] = useState(false);
  const [modalTitle, setModalTitle] = useState("Error");
  const [modalBody, setModalBody] = useState("");
  const [modalBtn, setModalBtn] = useState(
    <Button variant="primary" onClick={handleClose}>
      Close
    </Button>
  );
  console.log(nameValidation)

  function handleClose() {
    setShow(false);
  }
  async function onCreateProduct(e) {
    const form = e.currentTarget;
    e.preventDefault();
    setNameValidation(true);
    setPriceValidation(true);
    console.log(nameValidation)
    console.log(priceValidation)
    if (form.checkValidity() === false) {
      console.log("checkvalidity FALSE");
    }

    if (form.checkValidity() === true && productName.length > 2 && productPrice > 0) {
      console.log("checkvalidity TRUE");
        await axios
          .post(SupplicoWebAPI_URL + "/products", {
            name: productName,
            price: productPrice,
            userId: getItem(Keys.userId),
          })
          .then((res) => {
            console.log(res);
            setShow(true);
            setModalBody(
              "Product added successfully now other users can see it!"
            );
            setModalTitle("Product Added");
            setModalBtn(
              <NavLink className="btn btn-primary" to={`/products`} onClick={handleClose}>
                Close
              </NavLink>
            );
          })
          .catch((err) => {
            setShow(true);
            setModalBody(err.message);
          });
      } else {
        setShow(true);
        setModalBody(
          "an error is been occurred with the data inputed, please check your details"
        );
    }
  }

  return (
    <div className="registration">
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalBody}</Modal.Body>
        <Modal.Footer>{modalBtn}</Modal.Footer>
      </Modal>

      <p style={{ visibility: "hidden" }}>2</p>

      <Form
        method="post"
        className="registration-form"
        onSubmit={onCreateProduct}
        encType="application/json"
        noValidate
      >
      <div className="text-center text-black">
        <h1>Create Product</h1>
      </div>
        <Form.Group controlId="formProductName">
          <Form.Label className="registration-label">Product Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            isInvalid={!(productName.length > 2) && nameValidation}
            required
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid product name atleast 2 characters
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formPrice">
          <Form.Label className="registration-label">Price</Form.Label>
          <Form.Control
            type="number"
            placeholder="Price"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            isInvalid={!(productPrice > 0) && priceValidation}
            required
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid price more than 0
          </Form.Control.Feedback>
        </Form.Group>
        <Button
          variant="primary"
          type="submit"
          className="registration-btn mb-2 mt-4"
          style={{width:"10em"}}
        >
          Create Product
        </Button>
      </Form>
    </div>
  );
}
