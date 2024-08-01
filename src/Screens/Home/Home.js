/* eslint-disable */
// import logo from './logo.svg';
import React, { useState, useEffect } from "react";
import '../Home/Home.css';
import { Routes, Route, Outlet, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BsPersonCircle } from "react-icons/bs";
import { Row, Col, NavItem, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { BsGraphUp, BsGeoAltFill } from "react-icons/bs";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Baseurl } from "../../Services/BaseUrl";
import Offcanvas from 'react-bootstrap/Offcanvas';
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem
} from 'reactstrap';
import { AiFillSignal, AiOutlineApartment, AiFillPicture } from "react-icons/ai";
import '../../assests/img/robo3.jpg';
// import Imagecollection from '../ImageCollection/Imagecollection';
// import SourceDataValidation from '../Dashboard/SourceDataValidation';
// import SourceReport from '../Dashboard/SourceReport';
// import LiveReport from '../Dashboard/LiveReport';
// import LiveDataValidation from '../Dashboard/LiveDataValidation';
// import Login from '../Login/Login';
// import ConsolidatedDataStats from '../Dashboard/ConsolidatedDataStats';
// import LiveModelReport from '../Dashboard/LiveModelReport';
// import MachinesTest from '../LabelConfiguration/MachinesTest'
// import ClassTest from '../LabelConfiguration/ClassTest';
// import SubclassTest from '../LabelConfiguration/SubclassTest';
// import HistoricalModelReport from '../Dashboard/HistoricalModelReport';
import RootStack from "../../Routes/RootStack";
import { NavLink,  useLocation, useNavigate} from 'react-router-dom'

function Home() {
  const location = useLocation();
  console.log('location:', location);

  //const history = useHistory()
  const navigate = useNavigate();
  var SESSIONDATA = localStorage.getItem('SESSIONDATA');
  var SessionSeconds = '';
  const [permissions, setPermissions] = useState([]);
//console.log('SESSION', SESSIONDATA);
  const [Session, setSession] = useState(JSON.parse(SESSIONDATA));
  const [userDetails, setUserDetails] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const handleClose = () => setUserDetails(false);
  const handleShow = () => setUserDetails(true);
  const [isContentToggled, setIsContentToggled] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState(null);
  const [open, setOpen] = useState('1');

  const toggle = (id) => {
    if (open === id) {
      setOpen();
    } else {
      setOpen(id);
    }
  };


// const MyRouting = () =>{
//   return(
//     <Routes path="">
//         <Route path="/login" element={<Login />} />
//         <Route path="/imagecollection" element={<Imagecollection />} />
//         <Route path="/SourceDataValidation" element={<SourceDataValidation />} />
//         <Route path="/sourcereport" element={<SourceReport />} />
//         <Route path="/liveDataValidation" element={<LiveDataValidation />} />
//         <Route path="/livereport" element={<LiveReport />} />
//         <Route path="/HistoricalModelReport" element={<HistoricalModelReport/>} />
//         <Route path="/ConsolidatedDataStats" element={<ConsolidatedDataStats />} />
//         <Route path="/LiveModelReport" element={<LiveModelReport />} />
//         <Route path="/MachinesTest" element={<MachinesTest />} />
//         <Route path="/ClassTest" element={<ClassTest />} />
//         <Route path="/SubclassTest" element={<SubclassTest />} />
//     </Routes>
//   );
// }

  // Handle click event on NavItem
  const handleNavItemClick = (navItem) => {
    if (activeNavItem === navItem) {
      setActiveNavItem(null); // Disable highlight if clicked again
    } else {
      setActiveNavItem(navItem); // Highlight the clicked navItem
    }
    // handleCloseMenu();
  };

  const [show, setShow] = useState(true);

  const handleCloseMenu = () => setShow(false);
  const handleShowMenu = () => setShow(true);

  useEffect(() => {
    if (SESSIONDATA === null || SESSIONDATA === undefined || SESSIONDATA === "") {
      window.location.href = window.location.origin;
    }

    SESSIONDATA = JSON.parse(localStorage.getItem('SESSIONDATA'));
    SessionSeconds = SESSIONDATA.access_token_expires_in_secs;

    console.log('machines load event...')

    var stop = setInterval(() => {
      if (SessionSeconds <= 0) {
        alert(' Your session is going to expire');
        handleLogout();
        return;
      }
      else {
        SessionSeconds = SessionSeconds - 1;
      }
    }, 1000)


    var perms = SESSIONDATA.permission;
    setPermissions(perms);

    return () => {
      clearInterval(stop);
    }
  }, []);




  const handleLogout = () => {
    if (window.confirm("Are you sure you want to Logout?")) {
      localStorage.setItem('TOKEN', "");
      localStorage.setItem('SESSIONDATA', "");

      window.location.href = window.location.origin;
    }
  }

  const handleClick = () => {
    history.push('/home'); // Replace '/other-page' with the desired URL or path
  };

  const userRoll = () => {
    setOpenProfile(true);

  }
  const toggleModal = () => {
    setOpenProfile(!openProfile);
  };

  const UserProfileModel = () => {
    return (
      <Container >
        <Row>
          <Col>
            <Modal isOpen={openProfile} toggle={toggleModal} >
              <ModalHeader
                style={{ backgroundColor: "#438a5e", padding: 10, color: "Black", textAlign: "center", font: "initial" }}>
                User Profile
              </ModalHeader>
              <ModalBody>
                <Row>
                  <Col sm={4}> User Name </Col>
                  <Col sm={2}>:</Col>
                  <Col sm={4}>{Session.user_name}</Col>
                </Row>
                <Row>
                  <Col sm={4}> User Role </Col>
                  <Col sm={2}>:</Col>
                  <Col sm={4}> {Session.role_name}</Col>
                </Row>


              </ModalBody>
              <ModalFooter>
                <Button title='Close' onClick={() => setOpenProfile(false)} style={{ marginRight: "20px", backgroundColor: "#438a5e" }}>OK</Button>
              </ModalFooter>
            </Modal >
          </Col>
        </Row>

      </Container>)
  }

  return (
    <div className="Home" style={{
      backgroundImage:
        "url(" + require("../../assests/img/robo3.jpg") + ")",
      backgroundSize: "cover"
    }}>



      <Row style={{ backgroundColor: "#438a5e" }}>
        <Col md="1" style={{ marginTop: "20px" }}>
          <a href='/home'>
            <img style={{
              backgroundImage:
                "url(" + require("../../assests/img/farmlogo2.png") + " )",
              backgroundSize: "cover", height: 27, width: 50, marginLeft: "20px"


            }} /></a>
        </Col>

        <Col md="7">
          <h5 style={{
            fontFamily: "initial", paddingLeft: "40%", backgroundColor: "#438a5e", color: "white",
            textAlign: "center", marginBottom: "20px",
            marginTop: "20px", fontWeight: "bold"
          }}>
            DATA MANAGEMENT & QUALITY CONTROL</h5>

        </Col>
        <Col md="3" style={{ marginTop: "10px", marginRight: "50px" }}>
          {/* <BsPersonCircle style={{ marginRight: "80px" }} /> */}
          <Row style={{  fontSize: 13,  }}>
            <Col sm={12}> <b>User Name</b><span style={{ marginLeft: 10 }}>:</span><b> {Session.user_name} </b></Col>
          </Row>
          <Row style={{  fontSize: 13 }}>
            <Col sm={12} style={{ marginLeft: "18px" }}> <b>User Role  </b>   <span style={{ marginLeft: 15 }}>:</span> <b >{Session.role_name}</b> </Col>
          </Row>


        </Col>
      </Row>

      <Row className="rownav" >
        <Col sm={2} className="nav" style={{ backgroundColor: "white" }}>
          <Accordion open={open} toggle={toggle} >
            <Offcanvas.Header style={{ marginBottom: "10px" }}>
            </Offcanvas.Header>
            {(permissions.includes("Data Label Access")) ?
              <AccordionItem className="custom-accordion-item" style={{ backgroundColor: "#1C2833" }}>
                <AccordionHeader targetId="3" > <h5 style={{
                  font: "initial", marginTop: "20px",
                  marginBottom: "10px"
                }}><AiFillSignal style={{marginRight:"10px"}} />Label Configuration</h5></AccordionHeader>
                <AccordionBody accordionId="3" style={{ backgroundColor: "#1C2833" }}>

                  <Nav vertical className="justify-content-end">

                    <NavItem className={activeNavItem === "machinestest" ? "active-nav-item" : ""}
                      style={{
                        fontFamily: "initial",
                        color: activeNavItem === 'machinestest' ? 'white' : 'black',
                        backgroundColor: activeNavItem === 'machinestest' ? 'gray' : 'transparent',
                        
                        marginLeft: "-10px", marginRight: "60px"
                      }}>
                      <NavLink to="machinestest" style={{ fontFamily: "initial", color: "whitesmoke" }}
                        onClick={() => handleNavItemClick("machinestest")}>
                        <BsGeoAltFill style={{ marginRight: "20px" }} />
                        Machines
                      </NavLink>
                    </NavItem>
                    <NavItem className={activeNavItem === "classtest" ? "active-nav-item" : ""}
                      style={{
                        fontFamily: "initial",
                        color: activeNavItem === 'classtest' ? 'white' : 'black',
                        backgroundColor: activeNavItem === 'classtest' ? 'gray' : 'transparent',
                       marginLeft: "-10px", marginRight: "90px"
                      }}>

                      <NavLink to="classtest" style={{ fontFamily: "initial", color: "whitesmoke" }}
                        onClick={() => handleNavItemClick("classtest")}>
                        <AiFillSignal style={{ marginRight: "20px" }} /> Class

                      </NavLink>
                    </NavItem>

                    <NavItem className={activeNavItem === "subclasstest" ? "active-nav-item" : ""}
                      style={{
                        fontFamily: "initial",
                        color: activeNavItem === 'subclasstest' ? 'white' : 'black',
                        backgroundColor: activeNavItem === 'subclasstest' ? 'gray' : 'transparent',
                       marginLeft: "-10px", marginRight: "70px"
                      }}>
                      <NavLink to="subclasstest" style={{ fontFamily: "initial", color: "whitesmoke" }}
                        onClick={() => handleNavItemClick("subclasstest")}>
                        <AiOutlineApartment style={{ marginRight: "20px" }} />
                        Subclass

                      </NavLink>
                    </NavItem>
                  </Nav>
                </AccordionBody>
              </AccordionItem> : <></>}


            {(permissions.includes("Data Collection Access")) ?
              <AccordionItem style={{ backgroundColor: "#1C2833" }}>
                <AccordionHeader targetId="4"><h5 style={{ font: "initial" }}>
                  <AiFillPicture style={{ marginRight: "11px" }} />Data Collection</h5></AccordionHeader>
                <AccordionBody accordionId="4" style={{ backgroundColor: "#1C2833" }}>
                  <Nav vertical >
                    <NavItem className={activeNavItem === "imagecollection" ? "active-nav-item" : ""}
                      style={{
                        fontFamily: "initial",
                        color: activeNavItem === 'imagecollection' ? 'white' : 'black',
                        backgroundColor: activeNavItem === 'imagecollection' ? 'gray' : 'transparent',
                        marginBottom: "20px", marginLeft: "30px"
                      }}>
                      <NavLink to="imagecollection" style={{ fontFamily: "initial", color: "whitesmoke" }}
                        onClick={() => handleNavItemClick("imagecollection")}>
                        <AiFillPicture style={{ marginRight: "20px", marginLeft: "-10px" }} />
                        Image Upload

                      </NavLink>
                    </NavItem>
                  </Nav>
                </AccordionBody>
              </AccordionItem>
              : <></>}

            {(permissions.includes("Data Validation Access")) ?
              <AccordionItem className="custom-accordion-item" style={{ backgroundColor: "#1C2833" }}>
                <AccordionHeader targetId="5">     <h5 style={{ font: "initial" }}> <AiFillSignal style={{ marginRight: "7px" }} /> Data Validation</h5>  </AccordionHeader>
                <AccordionBody accordionId="5" style={{ backgroundColor: "#1C2833" }}>
                  <Nav vertical >
                    <NavItem className={activeNavItem === "SourceDataValidation" ? "active-nav-item " : ""}
                      style={{
                        fontFamily: "initial",
                        color: activeNavItem === 'SourceDataValidation' ? 'white' : 'black',
                        backgroundColor: activeNavItem === 'SourceDataValidation' ? 'gray' : 'transparent',
                        marginBottom: "20px", marginLeft: "-2px"
                      }}>
                      <NavLink to="SourceDataValidationnew" style={{ fontFamily: "initial", color: "whitesmoke" }}
                        onClick={() => handleNavItemClick("SourceDataValidationnew")}>
                        Source Data Validation
                        {/* <Link to="SourceDataValidation" style={{ fontFamily: "initial", color: "whitesmoke", marginBottom: "30px" }}>
                                      Source Data Validation
                                    </Link> */}
                      </NavLink>
                    </NavItem>
                    <NavItem className={activeNavItem === "liveSourceDataValidation" ? "active" : ""}
                      style={{
                        fontFamily: "initial",
                        color: activeNavItem === 'liveSourceDataValidation' ? 'white' : 'black',
                        backgroundColor: activeNavItem === 'liveSourceDataValidation' ? 'gray' : 'transparent',
                        marginBottom: "20px", marginLeft: "-2px"
                      }}>
                      <NavLink to="liveSourceDataValidation" style={{ fontFamily: "initial", color: "whitesmoke" }}
                        onClick={() => handleNavItemClick("liveSourceDataValidation")}>
                        Live Data Validation

                      </NavLink>
                    </NavItem>
                  </Nav>
                </AccordionBody>
              </AccordionItem>
              : <></>}
            {(permissions.includes("Report Access")) ?
              <AccordionItem>
                <AccordionHeader targetId="6">   <h5 style={{ font: "initial" }}><BsGraphUp style={{ marginRight: "10px" }} />Dashboard</h5>  </AccordionHeader>
                <AccordionBody accordionId="6" style={{ backgroundColor: "#1C2833" }}>
                  <Nav vertical >
                    <NavItem className={activeNavItem === "sourcereport" ? "active" : ""}
                      style={{
                        fontFamily: "initial",
                        color: activeNavItem === 'sourcereport' ? 'white' : 'black',
                        backgroundColor: activeNavItem === 'sourcereport' ? 'gray' : 'transparent',
                       
                      }}>
                      <NavLink to="sourcereport" style={{ fontFamily: "initial", color: "whitesmoke" }}
                        onClick={() => handleNavItemClick("sourcereport")}>
                        Source Static Report
                      </NavLink>

                    </NavItem>
                    <NavItem className={activeNavItem === "livereport" ? "active" : ""}
                      style={{
                        fontFamily: "initial",
                        color: activeNavItem === 'livereport' ? 'white' : 'black',
                        backgroundColor: activeNavItem === 'livereport' ? 'gray' : 'transparent',
                       
                      }}>
                      <NavLink to="livereport" style={{ fontFamily: "initial", color: "whitesmoke" }}
                        onClick={() => handleNavItemClick("livereport")}>

                        Live Static Report
                      </NavLink>

                    </NavItem>
                    <NavItem className={activeNavItem === "ConsolidatedConsolidatedDataStats" ? "active" : ""}
                      style={{
                        fontFamily: "initial",
                        color: activeNavItem === 'ConsolidatedDataStats' ? 'white' : 'black',
                        backgroundColor: activeNavItem === 'ConsolidatedDataStats' ? 'gray' : 'transparent',
                       
                      }}>
                      <NavLink to="ConsolidatedDataStats" style={{ fontFamily: "initial", color: "whitesmoke" }}
                        onClick={() => handleNavItemClick("ConsolidatedDataStats")}>

                        ConsolidatedData Statistics
                      </NavLink>

                    </NavItem>
                    <NavItem className={activeNavItem === "HistoricalModelReport" ? "active" : ""}
                      style={{
                        fontFamily: "initial",
                        color: activeNavItem === 'HistoricalModelReport' ? 'white' : 'black',
                        backgroundColor: activeNavItem === 'HistoricalModelReport' ? 'gray' : 'transparent',
                        
                      }}>
                      <NavLink to="HistoricalModelReport" style={{ fontFamily: "initial", color: "whitesmoke" }}
                        onClick={() => handleNavItemClick("HistoricalModelReport")}>

                        Historical Model Report
                      </NavLink>

                    </NavItem>
                    <NavItem className={activeNavItem === "LiveModelReport" ? "active" : ""}
                      style={{
                        fontFamily: "initial",
                        color: activeNavItem === 'LiveModelReport' ? 'white' : 'black',
                        backgroundColor: activeNavItem === 'LiveModelReport' ? 'gray' : 'transparent',
                       
                      }}>
                      <NavLink to="LiveModelReport" style={{ fontFamily: "initial", color: "whitesmoke" }}
                        onClick={() => handleNavItemClick("LiveModelReport")}>

                        Live Model Report
                      </NavLink>

                    </NavItem>
                    <NavItem>
                    </NavItem>
                  </Nav>
                </AccordionBody>
              </AccordionItem>
              : <></>}
            <AccordionItem targetId="7" style={{ marginTop: "-1px", cursor: "pointer" }} onClick={userRoll}>
              <h5 style={{ font: "initial", marginRight: "10px", marginBottom: "20px", marginTop: "1px", marginLeft: "-50px" }}
              >   <i className="fa fa-users" style={{ marginTop: "20px" }}></i>Users Profile</h5>
            </AccordionItem>
            <AccordionItem targetId="8" style={{ marginTop: "-1px" }} onClick={handleLogout}>
              <h5 style={{ font: "initial", marginRight: "100px", marginBottom: "20px", marginTop: "1px", marginLeft: "20px",marginTop:"20px" }}
              ><BsPersonCircle/> <span >Logout</span>  </h5>
            </AccordionItem>


          </Accordion>
          {openProfile == true ? <UserProfileModel /> : <></>}

        </Col>
        <Col sm={9} md={9} className="navcontent" >
          <Container >

            {/* <MyRouting></MyRouting> */}
    {/* <Routes path="">
        <Route path="/login" element={<Login />} />
        <Route path="/imagecollection" element={<Imagecollection />} />
        <Route path="/SourceDataValidation" element={<SourceDataValidation />} />
        <Route path="/SourceDataValidationnew" element={<SourceDataValidationnew />} />
        <Route path="/sourcereport" element={<SourceReport />} />
        <Route path="/liveSourceDataValidation" element={<LiveSourceDataValidation />} />
        <Route path="/livereport" element={<LiveReport />} />
        <Route path="/livereport" element={<LiveReport />} />
        <Route path="/HistoricalModelReport" element={<HistoricalModelReport />} />
        <Route path="/historical" element={<Historical />} />
        <Route path="/ConsolidatedDataStats" element={<ConsolidatedDataStats />} />
        <Route path="/LiveModelReport" element={<LiveModelReport />} />
        <Route path="/MachinesTest" element={<MachinesTest />} />
        <Route path="/ClassTest" element={<ClassTest />} />
        <Route path="/SubclassTest" element={<SubclassTest />} />
    </Routes> */}

            <RootStack></RootStack>
          </Container>


        </Col>
      </Row>
    </div >
  )

}
export default Home
