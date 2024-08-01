import React, { useState, useEffect } from "react";
import '../Home/Home.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BsPersonCircle } from "react-icons/bs";
import { Row, Col, NavItem, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { BsGraphUp, BsGeoAltFill } from "react-icons/bs";
import Nav from 'react-bootstrap/Nav';
import Offcanvas from 'react-bootstrap/Offcanvas';
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem
} from 'reactstrap';
import { AiFillSignal, AiOutlineApartment, AiFillPicture } from "react-icons/ai";

import RootStack from "../../Routes/RootStack";
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

function Home() {
  const location = useLocation();
  console.log('location:', location);

  const navigate = useNavigate();
  var SESSIONDATA = localStorage.getItem('SESSIONDATA');
  var SessionSeconds = '';
  const [permissions, setPermissions] = useState([]);
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

  const handleNavItemClick = (navItem) => {
    if (activeNavItem === navItem) {
      setActiveNavItem(null);
    } else {
      setActiveNavItem(navItem);
    }
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

    console.log('machines load event...');

    var stop = setInterval(() => {
      if (SessionSeconds <= 0) {
        alert(' Your session is going to expire');
        handleLogout();
        return;
      } else {
        SessionSeconds = SessionSeconds - 1;
      }
    }, 1000);

    var perms = SESSIONDATA.permission;
    setPermissions(perms);

    return () => {
      clearInterval(stop);
    };
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to Logout?")) {
      localStorage.setItem('TOKEN', "");
      localStorage.setItem('SESSIONDATA', "");
      window.location.href = window.location.origin;
    }
  };

  const userRoll = () => {
    setOpenProfile(true);
  };

  const toggleModal = () => {
    setOpenProfile(!openProfile);
  };

  const UserProfileModel = () => {
    return (
      <Container>
        <Row>
          <Col>
            <Modal isOpen={openProfile} toggle={toggleModal}>
              <ModalHeader
                style={{ backgroundColor: "#438a5e", padding: 10, color: "Black", textAlign: "center", font: "initial" }}
              >
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
            </Modal>
          </Col>
        </Row>
      </Container>
    );
  };

  return (
    <div className="Home">
      <Row style={{ backgroundColor: "#438a5e" }}>
        <Col md="1" style={{ marginTop: "20px" }}>
          <a href='/home'>
            <img style={{
              backgroundImage: "url(" + require("../../assests/img/farmlogo2.png") + " )",
              backgroundSize: "cover", height: 27, width: 50, marginLeft: "20px"
            }} />
          </a>
        </Col>

        <Col md="7">
          <h5 style={{
            fontFamily: "initial", paddingLeft: "40%", backgroundColor: "#438a5e", color: "white",
            textAlign: "center", marginBottom: "20px",
            marginTop: "20px", fontWeight: "bold"
          }}>
            DATA MANAGEMENT & QUALITY CONTROL
          </h5>
        </Col>
        <Col md="3" style={{ marginTop: "10px", marginRight: "50px" }}>
          <Row style={{ fontSize: 13 }}>
            <Col sm={12}> <b>User Name</b><span style={{ marginLeft: 10 }}>:</span><b> {Session.user_name} </b></Col>
          </Row>
          <Row style={{ fontSize: 13 }}>
            <Col sm={12} style={{ marginLeft: "18px" }}> <b>User Role  </b> <span style={{ marginLeft: 15 }}>:</span> <b >{Session.role_name}</b> </Col>
          </Row>
        </Col>
      </Row>

      <Row className="rownav">
        <Col sm={2} className="nav">
          <Accordion open={open} toggle={toggle}>
            <Offcanvas.Header style={{ marginBottom: "10px" }}></Offcanvas.Header>
            {(permissions.includes("Data Label Access")) ?
              <AccordionItem className="custom-accordion-item">
                <AccordionHeader targetId="3">
                  <h5 style={{ font: "initial", marginTop: "10px", marginBottom: "10px" }}>
                    <AiFillSignal style={{ marginRight: "10px" }} />Label Configuration
                  </h5>
                </AccordionHeader>
                <AccordionBody accordionId="3">
                  <Nav vertical className="justify-content-end">
                    <NavItem className={activeNavItem === "machinestest" ? "active-nav-item" : ""}
                      style={{ fontFamily: "initial", marginLeft: "-10px", marginRight: "60px" }}>
                      <NavLink to="machinestest" style={{ fontFamily: "initial", color: "black" }}
                        onClick={() => handleNavItemClick("machinestest")}>
                        <BsGeoAltFill style={{ marginRight: "20px" }} />
                        Machines
                      </NavLink>
                    </NavItem>
                    <NavItem className={activeNavItem === "classtest" ? "active-nav-item" : ""}
                      style={{ fontFamily: "initial", marginLeft: "-10px", marginRight: "90px" }}>
                      <NavLink to="classtest" style={{ fontFamily: "initial", color: "black" }}
                        onClick={() => handleNavItemClick("classtest")}>
                        <AiFillSignal style={{ marginRight: "20px" }} /> Class
                      </NavLink>
                    </NavItem>
                    <NavItem className={activeNavItem === "subclasstest" ? "active-nav-item" : ""}
                      style={{ fontFamily: "initial", marginLeft: "-10px", marginRight: "70px" }}>
                      <NavLink to="subclasstest" style={{ fontFamily: "initial", color: "black" }}
                        onClick={() => handleNavItemClick("subclasstest")}>
                        <AiOutlineApartment style={{ marginRight: "20px" }} />
                        Subclass
                      </NavLink>
                    </NavItem>
                  </Nav>
                </AccordionBody>
              </AccordionItem> : <></>}

            {(permissions.includes("Data Collection Access")) ?
              <AccordionItem className="custom-accordion-item">
                <AccordionHeader targetId="4">
                  <h5 style={{ font: "initial" }}>
                    <AiFillPicture style={{ marginRight: "11px" }} />Data Collection
                  </h5>
                </AccordionHeader>
                <AccordionBody accordionId="4">
                  <Nav vertical className="justify-content-end">
                    <NavItem className={activeNavItem === "imagecollection" ? "active-nav-item" : ""}
                      style={{ fontFamily: "initial", marginLeft: "-10px", marginRight: "30px" }}>
                      <NavLink to="imagecollection" style={{ fontFamily: "initial", color: "black" }}
                        onClick={() => handleNavItemClick("imagecollection")}>
                        <AiFillPicture style={{ marginRight: "20px" }} />
                        Data Collection
                      </NavLink>
                    </NavItem>
                  </Nav>
                </AccordionBody>
              </AccordionItem> : <></>}

              {(permissions.includes("Data Validation Access")) ?
              <AccordionItem className="custom-accordion-item">
                <AccordionHeader targetId="5">
                  <h5 style={{ font: "initial" }}>
                    <AiFillPicture style={{ marginRight: "11px" }} />Data Validation
                  </h5>
                </AccordionHeader>
                <AccordionBody accordionId="5">
                  <Nav vertical className="justify-content-end">
                  <NavItem className={activeNavItem === "SourceDataValidationnew" ? "active-nav-item" : ""}
                      style={{ fontFamily: "initial", marginLeft: "-10px", marginRight: "90px" }}>
                      <NavLink to="SourceDataValidationnew" style={{ fontFamily: "initial", color: "black" }}
                        onClick={() => handleNavItemClick("SourceDataValidationnew")}>
                        <AiFillSignal style={{ marginRight: "20px" }} /> Source Data Validation
                      </NavLink>
                    </NavItem>
                    <NavItem className={activeNavItem === "liveSourceDataValidation" ? "active-nav-item" : ""}
                      style={{ fontFamily: "initial", marginLeft: "-10px", marginRight: "90px" }}>
                      <NavLink to="liveSourceDataValidation" style={{ fontFamily: "initial", color: "black" }}
                        onClick={() => handleNavItemClick("liveSourceDataValidation")}>
                        <AiFillSignal style={{ marginRight: "20px" }} /> Live Data Validation
                      </NavLink>
                    </NavItem>
                  </Nav>
                </AccordionBody>
              </AccordionItem> : <></>}

              {(permissions.includes("Report Access")) ?
              <AccordionItem className="custom-accordion-item">
                <AccordionHeader targetId="6">
                  <h5 style={{ font: "initial" }}>
                  <BsGraphUp style={{ marginRight: "10px" }} />Dashboard
                  </h5>
                </AccordionHeader>
                <AccordionBody accordionId="6">
                  <Nav vertical className="justify-content-end">
                  <NavItem className={activeNavItem === "sourcereport" ? "active-nav-item" : ""}
                      style={{ fontFamily: "initial", marginLeft: "-10px", marginRight: "90px" }}>
                      <NavLink to="sourcereport" style={{ fontFamily: "initial", color: "black" }}
                        onClick={() => handleNavItemClick("sourcereport")}>
                        <AiFillSignal style={{ marginRight: "20px" }} /> Source Static Report
                      </NavLink>
                    </NavItem>
                    <NavItem className={activeNavItem === "livereport" ? "active-nav-item" : ""}
                      style={{ fontFamily: "initial", marginLeft: "-10px", marginRight: "90px" }}>
                      <NavLink to="livereport" style={{ fontFamily: "initial", color: "black" }}
                        onClick={() => handleNavItemClick("livereport")}>
                        <AiFillSignal style={{ marginRight: "20px" }} /> Live Static Report
                      </NavLink>
                    </NavItem>
                    <NavItem className={activeNavItem === "ConsolidatedDataStats" ? "active-nav-item" : ""}
                      style={{ fontFamily: "initial", marginLeft: "-10px", marginRight: "90px" }}>
                      <NavLink to="ConsolidatedDataStats" style={{ fontFamily: "initial", color: "black" }}
                        onClick={() => handleNavItemClick("ConsolidatedDataStats")}>
                        <AiFillSignal style={{ marginRight: "20px" }} /> ConsolidatedData Statistics
                      </NavLink>
                    </NavItem>
                    <NavItem className={activeNavItem === "HistoricalModelReport" ? "active-nav-item" : ""}
                      style={{ fontFamily: "initial", marginLeft: "-10px", marginRight: "90px" }}>
                      <NavLink to="HistoricalModelReport" style={{ fontFamily: "initial", color: "black" }}
                        onClick={() => handleNavItemClick("HistoricalModelReport")}>
                        <AiFillSignal style={{ marginRight: "20px" }} /> Historical Model Report
                      </NavLink>
                    </NavItem>
                    <NavItem className={activeNavItem === "LiveModelReport" ? "active-nav-item" : ""}
                      style={{ fontFamily: "initial", marginLeft: "-10px", marginRight: "90px" }}>
                      <NavLink to="LiveModelReport" style={{ fontFamily: "initial", color: "black" }}
                        onClick={() => handleNavItemClick("LiveModelReport")}>
                        <AiFillSignal style={{ marginRight: "20px" }} /> Live Model Report
                      </NavLink>
                    </NavItem>
                  </Nav>
                </AccordionBody>
              </AccordionItem> : <></>}
              <AccordionItem targetId="7" style={{cursor: "pointer" }} onClick={userRoll}>
              <h5 style={{ font: "initial", marginRight: "10px", marginBottom: "20px",  marginLeft: "-50px" }}
              >   <i className="fa fa-users" style={{ marginTop: "20px" }}></i>Users Profile</h5>
            </AccordionItem>

            <AccordionItem targetId="8" style={{ marginTop: "-1px" }} onClick={handleLogout}>
              <h5 style={{ font: "initial", marginRight: "100px", marginBottom: "20px", marginTop: "1px", marginLeft: "20px"}}
              ><BsPersonCircle/> <span >Logout</span>  </h5>
            </AccordionItem>

          </Accordion>

          {openProfile == true ? <UserProfileModel /> : <></>}
        </Col>  

        <Col sm={10}>
          <RootStack />
        </Col>
      </Row>
      <UserProfileModel />
    </div>
  );
}

export default Home;
