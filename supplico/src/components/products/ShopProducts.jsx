import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import { SupplicoWebAPI_URL } from "../../utils/settings";
import CustomModal from "../layout/CustomModal";

export default function ShopProducts() {
  const [products, setProducts] = useState();
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState();
  const [shopList, setShopList] = useState([]);
  const { supplierid } = useParams();
  const [list, setList] = useState([]);
  const [listMsg, setListMsg] = useState();

  const handleClose = () => setShow(false);

  function handleClick(value) {
    list.push(value);
    setShopList(list);
    console.log(shopList);
  }

  function handleReset() {
    setList([]);
    setShopList([]);
  }

  function showList() {
    setShow(true);
    setListMsg(
      <ul>
        {shopList.map(({ name }) => (
          <li>{name}</li>
        ))}
      </ul>
    );
  }

  useEffect(() => {
    axios
      .get(SupplicoWebAPI_URL + "/products/supplier/" + supplierid)
      .then((res) => {
        if (res.data) {
          setProducts(res.data);
          console.log(res.data);
          setLoading(false);
        } else console.log("empty response.data");
      })
      .catch((err) => {
        setShow(true);
        setErrorMessage(err.message);
      });
  }, []);

  if (!loading) {
    return (
      <>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Shopping List</Modal.Title>
          </Modal.Header>
          <Modal.Body>{listMsg}</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <div className="shopping-background">
          <div className="text-center text-black pt-5">
            <h1>
              The Shop Of: <b>{products.fullName}</b>
            </h1>
            <h3>Here you can view your profile card</h3>
            <Button
              className="mb-1"
              style={{ border: "solid 1px black" }}
              variant="light"
              onClick={() => showList()}
            >
              Show List
            </Button>
            <br />
            <Button onClick={() => handleReset()}>RESET</Button>
          </div>
          <table className="table shopping-table">
            <thead>
              <tr>
                <th>Id</th>
                <th>Products Name</th>
                <th>Product Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.price}</td>
                  <td>
                    <Button variant="dark" onClick={() => handleClick(p)}>
                      Add to cart
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="share-info">*Please do not share this information</p>
        </div>
      </>
    );
  } else {
    return (
      <>
        <CustomModal title="Error" body={errorMessage} defaultShow={true} />
        <h1 className="text-center">LOADING...</h1>
      </>
    );
  }
}
