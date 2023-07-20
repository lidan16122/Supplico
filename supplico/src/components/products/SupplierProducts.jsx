import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import { SupplicoWebAPI_URL } from "../../utils/settings";
import CustomModal from "../layout/CustomModal";
import { Keys, getItem } from "../../utils/storage";
import { NavLink } from "react-router-dom";

export default function SupplierProducts() {
  const [products, setProducts] = useState();
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        setErrorMessage(err.message);
      });
  }, []);


  if (!loading) {
    return (
      <>
        <div className="shopping-background">
          <div className="text-center text-black pt-5 mb-5">
            <h1>
              The Shop Of: <b style={{ color: "#ff851b" }}>{getItem(Keys.fullName)}</b>
            </h1>
            <h3>Here are the shop products:</h3>
            <NavLink to="/products/create-product">Create new product</NavLink>
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
                    <Button variant="success" >
                      Edit
                    </Button>
                    |
                    <Button variant="danger">
                      Delete
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
  }
  else {
    return (
      <>
        {errorMessage ? (
          <CustomModal title="Error" body={errorMessage} defaultShow={true} />
        ) : (
          ""
        )}
        <h1 className="text-center">LOADING...</h1>
      </>
    );
  }
}
