import React, { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import Navigation from "./Navigation";
import { Keys, getItem } from "../../utils/storage";
import { useNavigate } from "react-router-dom";
import HamburgerNav from "./HamburgerNav";

export default function Header(props) {
  let { isLoggedIn, roleID, logout } = useContext(AuthContext);
  let { siteImg } = props;
  let image = <img src={siteImg} alt="Site Image" id="siteImg" />;
  let logoutBtn = <span onClick={onLogout}>Logout</span>;
  let navigate = useNavigate();
  const [hamNav, setHamNav] = useState(undefined);

  function onLogout() {
    navigate("/");
    logout();
  }

  if (isLoggedIn) {
    return (
      <>
        {hamNav ? <HamburgerNav setHamNav={setHamNav} /> : ""}

        <header>
          <Navigation
            links={[
              { route: "/", text: image },
              {
                route:
                  roleID == 4 ? "/users" : `/users/${getItem(Keys.userId)}`,
                text: roleID == 4 ? "Users" : "My Profile",
              },
              {
                route: "/products",
                text: roleID == 3 ? "My Shop" : "Products",
              },
              { route: "/orders", text: roleID == 4 ? "Orders" : "My Orders" },
              {
                route: "/order-items",
                text: "Items Ordered",
              },
              { route: "#", text: logoutBtn },
            ]}
          />
          <div
            className="hamburger fa fa-bars"
            onClick={() => setHamNav("active")}
          ></div>
        </header>
      </>
    );
  } else {
    return (
      <>
        {hamNav ? <HamburgerNav setHamNav={setHamNav} /> : ""}
        
        <header>
          <Navigation
            links={[
              { route: "/", text: image },
              { route: "/about-us", text: "About Us" },
              { route: "/privacy-policy", text: "Privacy Policy" },
              { route: "/credits", text: "Credits" },
              { route: "/login", text: "Login" },
            ]}
          />
          <div
            className="hamburger fa fa-bars"
            onClick={() => setHamNav("active")}
          ></div>
        </header>
      </>
    );
  }
}
