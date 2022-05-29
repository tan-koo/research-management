
import React, { useEffect, useState, useContext } from 'react'
import firebaseApp from '../firebase.js';
import { Redirect } from 'react-router-dom'
import { AuthContext } from "components/Auth/Auth.js";

import {
  Button, Card, CardHeader, CardBody, CardFooter,
  CardTitle, FormGroup, Form, Input, Row,
  Col, InputGroup, InputGroupText
} from "reactstrap";

const LogIn = () => {
  const [Email, setEmail] = useState('')
  const [EmailError, setEmailError] = useState('')
  const [PasswordError, setPasswordError] = useState('')

  const clearErrors = () => {
    setEmailError('');
    setPasswordError('');
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    clearErrors();

    const { email, password } = e.target.elements;

    email.value = Email

    try {

      firebaseApp.auth().signInWithEmailAndPassword(email.value, password.value)
        .catch((error) => {
          switch (error.code) {
            case "auth/invalid-email":
            case "auth/user-disabled":
            case "auth/user-not-found":
              setEmailError(error.message);
              break;
            case "auth/wrong-password":
              setPasswordError(error.message);
              break;
          }
        });

    } catch (error) { alert(error); }
  }

  const goToRegis = () => { window.location.href = "/general/regis"; }

  const doFullEmail = (e) => {
    const full = e + '@mail.kmutt.ac.th'
    setEmail(full)
  }

  const forgotPassword = (Email) => {
    firebaseApp.auth().sendPasswordResetEmail(Email)
      .then(function (user) { alert('Please check your email...') })
      .catch(function (e) { console.log(e) })
  }

  const { currentUser } = useContext(AuthContext);

  if (currentUser) { return <Redirect to="/member/profile" />; }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }} className="content">
      <Col md="6">
        <Card className="card-user">
          <CardBody>
            <Form onSubmit={handleSubmit}>
              <CardTitle style={{ display: "flex", justifyContent: "center", alignItems: "center" }} className="content">
                <h3>Login</h3>
              </CardTitle>
              <Row>
                <Col md="12">
                  <FormGroup>
                    <label>Email</label>
                    <InputGroup>
                      <Input onChange={e => doFullEmail(e.target.value)} name="email" required />
                      <InputGroupText>@mail.kmutt.ac.th</InputGroupText>
                    </InputGroup>
                  </FormGroup>
                  <a className="color-error">{EmailError}</a>
                </Col>
              </Row>
              <Row>
                <Col md="12">
                  <FormGroup>
                    <label>Password</label>
                    <Input type="password" name="password" />
                  </FormGroup>
                  <a className="color-error">{PasswordError}</a>
                </Col>
              </Row>

              <p><b class="btn22 default" onClick={() => forgotPassword(Email)}>Forgot Password</b></p>
              <Row>
                <div className="box-btn">
                  <Button className="button-login" color="danger" type="submit">
                    LOGIN
                  </Button>
                  <div className="box-or mt-3">
                    <div className="line"></div>
                    <div className="lightGray-textSize or">OR</div>
                    <div className="line"></div>
                  </div>
                  <Button className="button-regis" color="info" onClick={() => goToRegis()} outline>
                    REGISTER
                  </Button>
                </div>
              </Row>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </div>
  );
}

export default LogIn;
