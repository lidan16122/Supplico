import React, { useState, useEffect, useContext } from "react";
import { NavLink, json, useParams } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import { SupplicoWebAPI_URL } from "../../utils/settings";
import CustomModal from "../layout/CustomModal";
import { Keys, getItem } from "../../utils/storage";
import AuthContext from "../context/AuthContext";
import Cart from "./Cart";
import siteImg from "../../assets/logo.png";
import Loading from "../layout/Loading";

export default function ShopProducts() {
  const [products, setProducts] = useState();
  const [originalProducts, setOriginalProducts] = useState([]);
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
  const [search, setSearch] = useState("");

  const handleClose = () => setShow(false);

  function handleClick(value) {
    setCart(false);
    list.push(value);
    setShopList(list);
  }

  function handleList() {
    setShow(true);
    showList();
  }
  function handleCart() {
    setCart(true);
    showList();
  }

  function handleReset() {
    setCart(false);
    setList([]);
    setShopList([]);
  }

  function showList() {
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
          setOriginalProducts(res.data);
          setName(res.data[0].userFullName);
          setLoading(false);
        } else alert("empty response.data");
      })
      .catch((err) => {
        setErrorMessage(err.message + ", " + err.response.data);
      });
  }, []);

  function makeOrder() {
    if (shopList.length > 0) {
      axios
        .post(SupplicoWebAPI_URL + "/orders", {
          sum: currentSum,
          quantity: shopList.length,
          supplierId: supplierid,
          businessId: getItem(Keys.userId),
        })
        .then((res) => {
          handleOrderItems(shopList.map((p) => p.name));
        })
        .catch((err) => {
          setErrorMessage(err.message + ", " + err.response.data);
        });
    } else {
      alert("nothing in shopping cart");
    }
  }

  async function handleOrderItems(arr) {
    arr.sort();

    let groupedArray = [];
    let currentGroup = [arr[0]];

    for (let i = 1; i < arr.length; i++) {
      if (arr[i] === arr[i - 1]) {
        currentGroup.push(arr[i]);
      } else {
        groupedArray.push(currentGroup);
        currentGroup = [arr[i]];
      }
    }

    groupedArray.push(currentGroup);
    console.log(groupedArray);
    let result = [[],[]];
    if (groupedArray.length < 2) {
      result = [[]]
    }
    for (let i = 0; i < groupedArray.length; i++) {
      let productId = 0;
      let productQuantity = groupedArray[i].length;
      for (let j = 0; j < products.length; j++) {
        if (products[j].name == groupedArray[i][0]) {
          productId = products[j].id;
        }
      }
      console.log(productId);
      console.log(productQuantity);
      result[i].push(productId)
      result[i].push(productQuantity)
    }
    console.log(result);
    let resultJson = JSON.stringify(result);
    console.log(resultJson);
      try {
        const response = await axios({
          method: "post",
          url: `${SupplicoWebAPI_URL}/orderItems`,
          data: resultJson,
          headers: { "Content-Type": "application/json" },
        });
      } catch (err) {
        setErrorMessage(err.message + ", " + err.response.data);
      }
      finally{
        if (!errorMessage) {
          setOrder(true);
        }
      }
  }



  function handleSearch() {
    if (!search) {
      setProducts(originalProducts);
    } else {
      setProducts(
        originalProducts.filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }

  if (!loading && !order && (roleID == 1 || roleID == 2)) {
    return (
      <>
        {cart && roleID == 1 ? (
          <Cart setCart={setCart} listMsg={listMsg} makeOrder={makeOrder} />
        ) : (
          ""
        )}
        <div style={{ overflowY: "auto" }}>
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
        </div>

        {roleID == 1 ? (
          <Button className="shopping-cart" onClick={() => handleCart()}>
            Cart{">>"}
          </Button>
        ) : (
          ""
        )}

        <div className="products-background">
          <div className="text-center text-black pt-5 mb-5">
            <h1 className="components-title">
              The Shop Of: <b style={{ color: "#ff851b" }}>{name}</b>
            </h1>
            <h3>Here are the shop products:</h3>
            {roleID == 1 ? (
              <>
                <Button
                  className="mb-2"
                  style={{ border: "solid 1px black" }}
                  variant="light"
                  onClick={() => handleList()}
                >
                  Shopping Cart
                </Button>
                <br />
                <Button
                  className="reset-shopping-cart mb-2"
                  onClick={() => handleReset()}
                >
                  RESET
                </Button>
              </>
            ) : (
              ""
            )}
            <br />
            <input
              type="text"
              name="search bar"
              placeholder="search name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>{" "}
          </div>
          <table className="table products-table">
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
                    {roleID == 1 ? (
                      <Button variant="dark" onClick={() => handleClick(p)}>
                        Add to cart
                      </Button>
                    ) : (
                      "Not availabe as DRIVER"
                    )}
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
      <div className="text-black text-center pt-5 mb-5">
        <h1>Transaction Completed</h1>
        <h3>please wait for supplier confirmation and driver confirmation</h3>
        <h3 className="pb-3">you can view your orders in "My Orders" tab</h3>
        <NavLink to="/" className="link-none order-complete-link">
          Redirct to home
        </NavLink>
        <br />
        <img
          src={siteImg}
          alt="site image"
          className="order-complete-img mt-5 mb-5"
        />
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
        {roleID == 1 ? (
          <Loading />
        ) : (
          <h1 className="text-center text-black mt-5 mb-5">
            Unauthorized Business Route
          </h1>
        )}
      </>
    );
  }
}
