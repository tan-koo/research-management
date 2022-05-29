import React, { useState } from "react";
import firebaseApp from "../firebase.js";
import { Redirect } from "react-router-dom";

import Popup from "views/Popup.js";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
  Table,
} from "reactstrap";
import Carousel from "react-bootstrap/Carousel";

const Register = () => {
  const [currentUser, setCurrentUser] = useState(null);

  const db = firebaseApp.firestore();
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };
  if (currentUser) {
    return <Redirect to="login" />;
  }

  return (
    <>
      <div className="content">
        <Row>
          <Col md="5">
            <Card className="card-user">
              <CardHeader>
                <CardTitle className="content">
                  <h3>ระบบจัดการสมาชิก</h3>
                </CardTitle>
              </CardHeader>
              <CardBody>
                <p>
                  holmestong@gmail.com ณัฐภัทร วรรณวัฒ&nbsp;&nbsp;
                  <button class="btn btn-info">ดูโปรไฟล์</button>
                  <button class="btn btn-success" onClick={togglePopup}>
                    เพิ่มโปรโมชั่น
                  </button>
                </p>
                <p>
                  holmestong@gmail.com ณัฐภัทร วรรณวัฒ&nbsp;&nbsp;
                  <button class="btn btn-info">ดูโปรไฟล์</button>
                  <button class="btn btn-success" onClick={togglePopup}>
                    เพิ่มโปรโมชั่น
                  </button>
                </p>
                <p>
                  holmestong@gmail.com ณัฐภัทร วรรณวัฒ&nbsp;&nbsp;
                  <button class="btn btn-info">ดูโปรไฟล์</button>
                  <button class="btn btn-success" onClick={togglePopup}>
                    เพิ่มโปรโมชั่น
                  </button>
                </p>
                <p>
                  holmestong@gmail.com ณัฐภัทร วรรณวัฒ&nbsp;&nbsp;
                  <button class="btn btn-info">ดูโปรไฟล์</button>
                  <button class="btn btn-success" onClick={togglePopup}>
                    เพิ่มโปรโมชั่น
                  </button>
                </p>
                <p>
                  holmestong@gmail.com ณัฐภัทร วรรณวัฒ&nbsp;&nbsp;
                  <button class="btn btn-info">ดูโปรไฟล์</button>
                  <button class="btn btn-success" onClick={togglePopup}>
                    เพิ่มโปรโมชั่น
                  </button>
                </p>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {isOpen && (
          <Popup
            content={
              <>
                <button class="btn btn-info">ยืนยัน</button>
              </>
            }
            handleClose={togglePopup}
          />
        )}
      </div>
    </>
  );
};

export default Register;
