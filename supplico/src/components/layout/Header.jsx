import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import Navigation from "./Navigation";
import { Keys, getItem } from "../../utils/storage";

//the navigation bar and the hamburger navigation bar in case the user is using a mobilephone
export default function Header(props) {
  let { isLoggedIn, roleID, logout } = useContext(AuthContext);
  let { siteImg } = props;
  let image = <img src={siteImg} alt="Site Image" id="siteImg" />;
  let logoutBtn = <span onClick={logout}>Logout</span>;

  if (isLoggedIn) {
    return (
      <>
        <header>
          <Navigation
            links={[
              { route: "/", text: image },
              {
                route:
                  roleID == 4 ? "/users" : `/users/${getItem(Keys.userId)}`,
                text: roleID == 4 ? "Users" : "My Profile",
              },
              { route: "/products", text: roleID == 3 ? "My Shop" : "Products" },
              { route: "/orders", text: roleID == 4 ? "Orders" : "My Orders" },
              {
                route:"/order-items" ,
                text:"Items Ordered",
              },
              { route: "#", text: logoutBtn },
            ]}
          />
        </header>
      </>
    );
  } else {
    return (
      <>
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
        </header>
      </>
    );
  }
}
