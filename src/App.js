/* eslint-disable */
import { Routes, Route, Outlet, Link } from "react-router-dom";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Screens/Login/Login';
import Routes from './Routes/RootStack';
import Home from "./Screens/Home/Home";

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
            "url(" + require("../src/assests/img/robo4.jpg") + ")",
          backgroundSize: "cover"
        }}>
    
          <Router>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/RootStack/*" element={<RootStack/>} />
            </Routes>
          </Router>
        </div>
      );
    }