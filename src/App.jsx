import React, { useState } from 'react';
import "./App.css";
//import Header from './components/Header/Header'
import Navbar from "./components/Navbar/Navbar";
import Cart from "./components/Cart/Cart";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  }
  return (
    <>
      <Navbar username="Nishiraj" toggleCart={toggleCart} ></Navbar>
      <Router>
        <Routes>
          <Route exact path="/" element={<Cart isOpen={isCartOpen} onClose={toggleCart} />} />
        </Routes>
      </Router>
    </>
  );
}
