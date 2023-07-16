import React, { useEffect, useState } from "react";
import axios from "axios";
import { SupplicoWebAPI_URL } from "../../utils/settings";
import { Button, Modal } from "react-bootstrap";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [show, setShow] = useState();

  const handleClose = () => setShow(false);

  useEffect(() => {
    getProducts();
  }, []);

  function getProducts() {
    axios
      .get(SupplicoWebAPI_URL + "/products")
      .then((res) => {
        if (res.data){
          setProducts(res.data);
          console.log(res.data)
        } 
        else console.log("empty response.data");
      })
      .catch((err) => {
        setShow(true);
        setErrorMessage(err.response.data);
      });
  }


  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="text-center mt-5 mb-5 admin-title">
        <h1>Products</h1>
        
      </div>

      <table className="table text-center admin-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Products Name</th>
            <th>Product Price</th>
            <th>User Created Id</th>
            <th>User Fullname</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td>{p.userId}</td>
              <td>{p.userFullName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
