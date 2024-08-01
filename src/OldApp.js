/* eslint-disable */
import React, { useState } from "react";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './Screens/Home/Home';
import Login from './Screens/Login/Login';

export default function App() {

  const [open, setOpen] = useState('1');
  const toggle = (id) => {
    if (open === id) {
      setOpen();
    } else {
      setOpen(id);
    }
  };
  return (
    <div id="app" className="App" style={{
      backgroundImage:
        "url(" + require("../src/assests/img/robo3.jpg") + ")",
      backgroundSize: "cover"
    }}>

      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home/*" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}