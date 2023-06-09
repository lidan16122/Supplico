import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/app.css";
import siteImg from "./assets/logo.png";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Login from "./components/registration/Login";
import Home from "./components/home/Home";
import ProtectedRoute from "./components/registration/ProtectedRoute";
import AuthContext from "./components/context/AuthContext";
import Register from "./components/registration/Register";
import Products from "./components/products/Products";
import Orders from "./components/orders/Orders";
import { Keys, getItem, setLoginData, removeLoginData } from "./utils/storage";
import { SupplicoWebAPI_URL } from "./utils/settings";
import axios from "axios";
import Users from "./components/users/Users";

function App() {
  let img = siteImg;
  let [isLoggedIn, setIsLoggedIn] = useState(false);
  let [roleID, setRoleID] = useState(0);
  let timerID = useRef();

  useEffect(() => {
    console.log("App useEffect", Date());
    console.log("settings.js SupplicoWebAPI_URL", SupplicoWebAPI_URL);
    //create a loop that refresh the tokens only if there is refreshToken
    if (getItem(Keys.refreshToken) && isNaN(timerID)) {
      setRefreshTokenInterval();
      refreshToken();
    }
  }, []);

  function setRefreshTokenInterval() {
    if (isNaN(timerID)) {
      let expiresInSeconds = getItem(Keys.expiresInSeconds);
      let refreshInterval = expiresInSeconds
        ? Number(expiresInSeconds) / 2
        : 30;
      timerID = setInterval(refreshToken, refreshInterval * 1000);
      console.log("starting refreshToken", refreshInterval, Date());
    }
  }

  function refreshToken() {
    console.log("refreshToken", Date());
    axios
      .post(SupplicoWebAPI_URL + "/users/refreshToken", {
        refreshToken: getItem(Keys.refreshToken),
      })
      .then((response) => {
        login(response.data);
      })
      .catch((error) => {
        logout();
      });
  }

  function login(loginData) {
    setLoginData(loginData.userResponse, loginData.tokensData);
    setRefreshTokenInterval();
    setRoleID(loginData.userResponse[Keys.roleID]);
    setIsLoggedIn(true);
  }

  function logout() {
    clearTimeout(timerID);
    removeLoginData();
    setIsLoggedIn(false);
  }

  return (
    <>
      <AuthContext.Provider value={{ isLoggedIn, roleID, login, logout }}>
        <BrowserRouter>
          <Header siteImg={img} />
          <Routes>
            <Route path="/" element={<Home siteImg={img} />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route
              path="products"
              element={
                <ProtectedRoute>
                  <Products />
                </ProtectedRoute>
              }
            />
            <Route
              path="orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="users"
              element={
                <ProtectedRoute>
                  <Users />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Footer />
        </BrowserRouter>
      </AuthContext.Provider>
    </>
  );
}

export default App;
