/* eslint-disable */
import React, { Component, useState, useEffect } from 'react'
import { Button, Row, Col, Container, Card } from 'reactstrap';
import { useNavigate, useLocation } from "react-router-dom";
import login from "./Login.css";
import { Baseurl } from "../../Services/BaseUrl";
export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword ] = React.useState("");

  const [emailError, setEmailError] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  
  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };
  
  const validatePassword = (password) => {
    // You can add your password validation logic here.
    // For example, you can check if the password meets certain criteria (length, special characters, etc.).
    // Return true if valid, false otherwise.
    return password.length >= 4; // This is a simple example; you can customize it.
  };
  

  useEffect(() => {
    localStorage.setItem('TOKEN', "");
    localStorage.setItem('SESSIONDATA', "");
  }, [])

  const handleLogin = () => {
    setEmailError("");
    setPasswordError("");
 // Validate email
 if (!validateEmail(email)) {
  setEmailError("Invalid email address");
  return;
}

// Validate password
if (!validatePassword(password)) {
  setPasswordError("Incorrect Password");
  return;
}
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiYWRtaW4iLCJleHAiOjE2Nzg4NjkwMzh9.JXWz7eHgDWuWtD6VAHBEQVyRBfFhbnMqfvnhKFORyok");
    var raw = JSON.stringify({
      "email": email,
      "password": password
    });
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(`${Baseurl}/loginuser`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log('post result', result);
        if (result && result.Status === 200) {
          localStorage.setItem('TOKEN', result.token);
          localStorage.setItem('USERNAME', email);
          localStorage.setItem('PASSWORD', password);
          localStorage.setItem('SESSIONDATA', JSON.stringify(result));
          localStorage.setItem('sessionstart', new Date());
          localStorage.setItem('Timeout', result.access_token_expires_in_secs);
          var t = new Date();
          t.setSeconds(t.getSeconds() + result.access_token_expires_in_secs);
          localStorage.setItem('Sessiontimeout', t);
          navigate('/home');
        } else {
          alert("Invalid User Credentials");
          console.log('API Failed:', result);
        }

      })
      .catch(error => {
        var er = error;
        alert('error', error);
      }
      );
  }

  return (
    <div id="loginbg" className="Login" style={{
      backgroundImage:
        "url(" + require("../../assests/img/back.png") + ")",
      backgroundSize: "cover", backgroundRepeat: "no-repeat", height: "100%"
    }}>
      <Container className="pt-3" fluid={true}>
        <h3 style={{ marginRight: "1000px", marginTop: "10px" }}>
          FARM ROBO <span style={{ color: "green" }}> DMQC </span>
        </h3>
      </Container>
      <Row>

      </Row>
      <Row >
        <Container style={{
          padding: 90,
          margin: "100",
          width: 500,
          heigth: "100",
          alignContent: "center",
          textAlign: "center",
          paddingRight: 100,
          marginTop: "100px",
        }}>

          <Row>
            <Card style={{ backgroundColor: "black", color: "white", opacity: 0.5 }}>

              <Col xs="12">
                <form>

                  <h4 style={{ color: "green", marginTop: "10px" }}>SIGN IN</h4>
                  <div className="mb-3">
                    <label style={{ marginRight: "160px", marginBottom: "5px", font: "initial" }}>Email address</label>
                    <input
                      type="email"
                      className={`form-control ${emailError ? "is-invalid" : ""}`}
                      placeholder="Enter Email"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {emailError && <div className="invalid-feedback">{emailError}</div>}
                  </div>

                  <div className="mb-3">
                    <label style={{ marginRight: "200px", marginBottom: "5px", font: "initial" }}>Password</label>
                    <input
                      type="password"
                      className={`form-control ${passwordError ? "is-invalid" : ""}`}
                      placeholder="Enter password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {passwordError && <div className="invalid-feedback">{passwordError}</div>}
                  </div>

                  <div className="mb-3">
                    <div className="custom-control custom-checkbox">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="customCheck1"
                      />
                      <label className="custom-control-label" htmlFor="customCheck1">
                        Remember me
                      </label>
                    </div>
                  </div>

                  <div className="d-grid gap-2 mt-3 ">
                    <center>
                      <Button onClick={handleLogin} style={{
                        backgroundColor: "#72c136",
                        color: "#fff",
                        textTransform: "initial",
                        fontSize: 17,

                        fontFamily: "initial",
                        width: 100
                      }}>Login</Button>
                    </center>
                  </div>
                  <p></p>
                </form>
              </Col>
            </Card>
          </Row>
        </Container>
        {/* </Card> */}
      </Row>
    </div>

  );
}



