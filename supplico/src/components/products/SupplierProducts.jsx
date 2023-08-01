import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import { SupplicoWebAPI_URL } from "../../utils/settings";
import CustomModal from "../layout/CustomModal";
import { Keys, getItem } from "../../utils/storage";
import { NavLink } from "react-router-dom";
import Loading from "../layout/Loading";

export default function SupplierProducts() {
  const [products, setProducts] = useState();
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts();
  }, []);

  function getProducts() {
    axios
      .get(SupplicoWebAPI_URL + "/products/" + getItem(Keys.userId))
      .then((res) => {
        if (res.data) {
          setProducts(res.data);
          console.log(res.data);
          setLoading(false);
        } else console.log("empty response.data");
      })
      .catch((err) => {
        setErrorMessage(err.message + ", " + err.response.data);
        if ((err.response.data = "Supplier has no products")) {
          setLoading(false);
        }
      });
  }

  function deleteProduct(id) {
    axios
      .delete(SupplicoWebAPI_URL + "/products/" + id)
      .then((res) => {
        getProducts();
      })
      .catch((err) => {
        setErrorMessage(err.response.data + ", " + err.message);
        if (err.message == "Supplier Has No Products") {
          setLoading(false);
        }
      });
  }

  if (!loading) {
    return (
      <>
        <div className="products-background">
          <div className="text-center text-black pt-5 mb-5">
            <h1 className="components-title">
              The Shop Of:
              <b style={{ color: "#ff851b" }}> {getItem(Keys.fullName)}</b>
            </h1>
            <h3>Here are the shop products:</h3>
            <Button className="create-product">
              <NavLink to="/products/create-product" className="link-none">
                Create new product
              </NavLink>
            </Button>
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
              {products ? (
                products.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.name}</td>
                    <td>{p.price}</td>
                    <td>
                      <Button variant="success" style={{ marginRight: "10px" }}>
                        <NavLink
                          to={`/products/${getItem(Keys.userId)}/${p.id}`}
                          className="link-none"
                        >
                          Edit
                        </NavLink>
                      </Button>
                      <b>|</b>
                      <Button
                        variant="danger"
                        style={{ marginLeft: "10px" }}
                        onClick={() => deleteProduct(p.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              )}
            </tbody>
          </table>
          <p className="share-info">*Please do not share this information</p>
        </div>
      </>
    );
  } else {
    return (
      <>
        {errorMessage ? (
          <CustomModal title="Error" body={errorMessage} defaultShow={true} />
        ) : (
          ""
        )}
        <Loading />
      </>
    );
  }
}
