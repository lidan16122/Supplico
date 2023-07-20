import React, { useState, useEffect, useContext } from "react";
import { NavLink, useParams } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import { SupplicoWebAPI_URL } from "../../utils/settings";
import CustomModal from "../layout/CustomModal";
import { Keys, getItem } from "../../utils/storage";
import AuthContext from "../context/AuthContext";
import Cart from "./Cart";

export default function ShopProducts() {
  const [products, setProducts] = useState();
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [shopList, setShopList] = useState([]);
  const [list, setList] = useState([]);
  const [listMsg, setListMsg] = useState();
  const [name, setName] = useState("");
  const [currentSum, setCurrentSum] = useState(0);
  const [order, setOrder] = useState(false);
  const { supplierid } = useParams();
  let { roleID } = useContext(AuthContext);
  const [cart, setCart] = useState(false);

  const handleClose = () => setShow(false);
  function handleClick(value) {
    setCart(false);
    list.push(value);
    setShopList(list);
    console.log(shopList);
  }

  function handleReset() {
    setCart(false);
    setList([]);
    setShopList([]);
  }

  function showList() {
    setCart(true);
    setShow(true);
    let sum = 0;
    shopList.forEach((v) => (sum += v.price));
    setCurrentSum(sum);
    setListMsg(
      <>
        <ol>
          {shopList.map(({ name }) => (
            <li>{name}</li>
          ))}
        </ol>
        <p>
          <b>
            SUM: {sum} | QUANTITY: {shopList.length}
          </b>
        </p>
      </>
    );
  }

  useEffect(() => {
    axios
      .get(SupplicoWebAPI_URL + "/products/" + supplierid)
      .then((res) => {
        if (res.data) {
          setProducts(res.data);
          console.log(res.data);
          setLoading(false);
          setName(products[0].userFullName);
        } else console.log("empty response.data");
      })
      .catch((err) => {
        setErrorMessage(err.message);
      });
  }, []);

  function makeOrder() {
    if (shopList.length > 0) {
      console.log("checkvalidity TRUE");
      axios.post(SupplicoWebAPI_URL + '/orders',{
        sum: currentSum,
        quantity: shopList.length,
        supplierConfirmation: false,
        driverConfirmation: false,
        supplierId: supplierid,
        businessId: getItem(Keys.userId)
      }).then((res) =>{
        console.log(res)
        setOrder(true);
      })
      .catch((err) => {
        console.log(err)
      })
    } else {
      alert("nothing in shopping cart")
    }
  }

  if (!loading && !order && roleID == 1) {
    return (
      <>
        {cart ? <Cart setCart={setCart} listMsg={listMsg} makeOrder={makeOrder} /> : ""}

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Shopping Cart</Modal.Title>
          </Modal.Header>
          <Modal.Body>{listMsg}</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="success" onClick={makeOrder}>
              Make Order
            </Button>
          </Modal.Footer>
        </Modal>

          <Button className="shopping-cart" onClick={() => showList()}>Cart{">>"}</Button>

        <div className="shopping-background">
          <div className="text-center text-black pt-5 mb-5">
            <h1>
              The Shop Of: <b style={{ color: "#ff851b" }}>{name}</b>
            </h1>
            <h3>Here are the shop products:</h3>
            <Button
              className="mb-1"
              style={{ border: "solid 1px black" }}
              variant="light"
              onClick={() => showList()}
            >
              Shopping Cart
            </Button>
            <br />
            <Button className="reset-shopping-cart" onClick={() => handleReset()}>RESET</Button>
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
  } else if (order && !loading && roleID == 1) {
    return (
      <div className="text-black text-center">
        <h1>Transaction Completed</h1>
        <h3>please wait for supplier confirmation and driver confirmation</h3>
        <h3>you can view your orders in "My Orders" tab</h3>
        <NavLink to="/">Redirct to home</NavLink>
      </div>
    );
  } else {
    return (
      <>
        {errorMessage ? (
          <CustomModal title="Error" body={errorMessage} defaultShow={true} />
        ) : (
          ""
        )}
        {roleID == 1 ? <h1 className="text-center">LOADING...</h1> : <h1 className="text-center text-black mt-5 mb-5">Unauthorized Business Route</h1>}
      </>
    );
  }
}
