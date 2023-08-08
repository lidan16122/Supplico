import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { Keys, getItem } from "../../utils/storage";

const HamburgerNav = ({ setHamNav }) => {
  let { isLoggedIn, roleID, logout } = useContext(AuthContext);
  let navigate = useNavigate();
  const handleClick = (link) => {
    navigate(link);
    setHamNav(undefined);
  };
  function onLogout() {
    navigate("/");
    logout();
  }
  if (isLoggedIn) {
    return (
      <>
        <ul
          className="ham-links container-fluid"
          style={{ paddingLeft: "0", paddingRight: "0" }}
        >
          <li className="col-12" onClick={() => handleClick("/")}>
            Home
          </li>
          <li
            className="col-12"
            onClick={() =>
              handleClick(
                roleID == 4 ? "/users" : `/users/${getItem(Keys.userId)}`
              )
            }
          >
            {roleID == 4 ? "Users" : "My Profile"}
          </li>
          <li className="col-12" onClick={() => handleClick("/products")}>
            {roleID == 3 ? "My Shop" : "Products"}
          </li>
          <li className="col-12" onClick={() => handleClick("/orders")}>
            {roleID == 4 ? "Orders" : "My Orders"}
          </li>
          <li className="col-12" onClick={() => handleClick("/order-items")}>
            Items Ordered
          </li>
          <li className="col-12" onClick={() => onLogout()}>
            Logout
          </li>
        </ul>
        <span
          className="go-back fa fa-arrow-right"
          onClick={() => setHamNav(undefined)}
        ></span>
      </>
    );
  }
  return (
    <>
      <ul
        className="ham-links container-fluid"
        style={{ paddingLeft: "0", paddingRight: "0" }}
      >
        <li className="col-12" onClick={() => handleClick("/")}>
          Home
        </li>
        <li className="col-12" onClick={() => handleClick("/about-us")}>
          About Us
        </li>
        <li className="col-12" onClick={() => handleClick("/privacy-policy")}>
          Privacy Policy
        </li>
        <li className="col-12" onClick={() => handleClick("/credits")}>
          Credits
        </li>
        <li className="col-12" onClick={() => handleClick("/login")}>
          Login
        </li>
      </ul>
      <span
        className="go-back fa fa-arrow-right"
        onClick={() => setHamNav(undefined)}
      ></span>
    </>
  );
};

export default HamburgerNav;
