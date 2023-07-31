import axios from "axios";
import React, { useEffect, useState } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import { SupplicoWebAPI_URL } from "../../utils/settings";
import { NavLink, useParams } from "react-router-dom";
import CustomModal from "../layout/CustomModal";

export default function EditProducts() {
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
  const { productid } = useParams();
  const [product, setProduct] = useState();
  const [loading, setLoading] = useState(true);

  function handleClose() {
    setShow(false);
  }

  useEffect(() => {
    axios
      .get(SupplicoWebAPI_URL + "/products/edit/" + productid)
      .then((res) => {
        console.log(res.data);
        setProduct(res.data);
        setLoading(false);
        setProductName(res.data.name)
        setProductPrice(res.data.price)
      })
      .catch((err) => {
        setModalBody(err.message);
      })
  }, []);

  async function onEditProduct(e) {
    const form = e.currentTarget;
    e.preventDefault();
    setNameValidation(true);
    setPriceValidation(true);
    console.log(nameValidation);
    console.log(priceValidation);
    if (form.checkValidity() === false) {
      console.log("checkvalidity FALSE");
    }

    if (
      form.checkValidity() === true &&
      productName.length > 2 &&
      productPrice > 0
    ) {
      console.log("checkvalidity TRUE");
      await axios
        .put(SupplicoWebAPI_URL + "/products", {
          name: productName,
          price: productPrice,
          id: product.id
        })
        .then((res) => {
          console.log(res);
          setShow(true);
          setModalBody(
            "Product successfully updated!"
          );
          setModalTitle("Product Updated");
          setModalBtn(
            <NavLink
              className="btn btn-primary"
              to={`/products`}
              onClick={handleClose}
            >
              Close
            </NavLink>
          );
        })
        .catch((err) => {
          setShow(true);
          setModalBody(err.response.data + ", " + err.message);
        });
    } else {
      setShow(true);
      setModalBody(
        "an error is been occurred with the data inputed, please check your details"
      );
    }
  }

  if (!loading) {
    
    return (
      <div className="primary-form-background">
        <Modal show={show} onHide={handleClose}>
          <Modal.Header>
            <Modal.Title>{modalTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{modalBody}</Modal.Body>
          <Modal.Footer>{modalBtn}</Modal.Footer>
        </Modal>

        <p style={{ visibility: "hidden" }}>2</p>

        <Form
          method="put"
          className="primary-form"
          onSubmit={onEditProduct}
          encType="application/json"
          noValidate
        >
          <div className="text-center text-black">
            <h1>Edit Product</h1>
            <h3>Editing "<b>{product.name}</b>"</h3>
          </div>
          <Form.Group controlId="formProductName">
            <Form.Label className="primary-label">Product Name</Form.Label>
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
            <Form.Label className="primary-label">Price</Form.Label>
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
            className="primary-form-btn mb-2 mt-4"
            style={{ width: "10em" }}
          >
            Update Product
          </Button>
        </Form>
      </div>
    );
  } else {
    return (
      <>
        {modalBody ? (
          <CustomModal title="Error" body={modalBody} defaultShow={true} />
        ) : (
          ""
        )}
        <h1 className="text-center">LOADING...</h1>
      </>
    );
  }
}
