import { useState, createContext } from "react";
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
function App() {
  let img = siteImg;
  let [isLoggedIn, setIsLoggedIn] = useState(true);
  let [role, setRole] = useState('business');

  return (
    <>
      <AuthContext.Provider value={{ isLoggedIn, role }}>
        <BrowserRouter>
          <Header siteImg={img} />
          <Routes>
            <Route path="/" element={<Home siteImg={img} />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="products" element={<ProtectedRoute>
              <Products />
            </ProtectedRoute>} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </AuthContext.Provider>
    </>
  );
}

export default App;
