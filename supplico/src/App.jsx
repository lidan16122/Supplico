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
import Register from "./components/registration/Register.jsx";
function App() {
  let img = siteImg;
  let [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      <AuthContext.Provider value={{ isLoggedIn }}>
        <BrowserRouter>
          <Header siteImg={img} />
          <Routes>
            <Route path="/" element={<Home siteImg={img} />} />
            <Route path="login" element={<Login />}/>
            <Route path="register" element={<Register />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </AuthContext.Provider>
    </>
  );
}

export default App;
