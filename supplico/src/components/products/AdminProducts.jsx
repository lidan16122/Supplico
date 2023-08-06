import React, { useEffect, useState } from "react";
import axios from "axios";
import { SupplicoWebAPI_URL } from "../../utils/settings";
import CustomModal from "../layout/CustomModal";
import { Keys, getItem } from "../../utils/storage";
import Loading from "../layout/Loading";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getProducts();
  }, []);

  function getProducts() {
    let options = {
      headers: {
        Authorization: `Bearer ${getItem(Keys.accessToken)}`,
      },
    };
    axios
      .get(SupplicoWebAPI_URL + "/products", options)
      .then((res) => {
        if (res.data) {
          setProducts(res.data);
          setOriginalProducts(res.data);
          setLoading(false);
        } else alert("empty response.data");
      })
      .catch((err) => {
        setErrorMessage(err.message);
      });
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

  if (!loading) {
    return (
      <>
        <div className="text-center mt-5 mb-5 admin-title">
          <h1>Products</h1>
          <h2>Showing All Products</h2>
          <br />
          <input
            type="text"
            name="search bar"
            placeholder="search name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={handleSearch}>
            Search
          </button>{" "}
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
