import "./App.css";
//import Header from './components/Header/Header'
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Navbar/>} />
        </Routes>
      </Router>
    </>
  );
}
