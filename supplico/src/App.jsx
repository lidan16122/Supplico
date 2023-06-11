import { useState } from 'react'
import { BrowserRouter, Routes, Route,  } from "react-router-dom";
import './styles/app.css'
import siteImg from './assets/logo.png'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer';
import Login from './components/registration/Login';
import Home from './components/Home';

function App() {
  let img = siteImg;
  return (
    <>
    <BrowserRouter>
      <Header siteImg={img}/>
      <Routes>
        <Route path='/' element={<Home siteImg={img}/>} />
        <Route path='login' element={<Login />} />
      </Routes>
      <Footer />
    </BrowserRouter>
    </>
  )
}

export default App
