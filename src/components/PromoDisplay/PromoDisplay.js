
import React, { useState, useEffect, useContext } from 'react';
import firebaseApp from 'firebase.js';
import { Redirect, useHistory } from 'react-router-dom'
import { AuthContext } from "components/Auth/Auth.js";
import { useLocation } from "react-router-dom";
// reactstrap components
import { Col, Card, Row } from "react-bootstrap";
import {
  Button, CardHeader, CardBody, CardFooter, CardTitle,
  FormGroup, Form, Input, InputGroup, InputGroupText,
  InputGroupAddon
} from "reactstrap";

// core components
import {
  dashboard24HoursPerformanceChart, dashboardEmailStatisticsChart, dashboardNASDAQChart
} from "variables/charts.js";

function PromoDisplay() {

  const [Promotions, setPromotions] = useState({})

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    //ใช้ firebaseApp.auth().onAuthStateChanged เพื่อใช้ firebaseApp.auth().currentUser โดยไม่ติด error เมื่อทำการ signout
    firebaseApp.auth().onAuthStateChanged(user => {
      const db = firebaseApp.firestore()
      const PromotionsCollection = db.collection('Promotions').where('Uid', 'array-contains-any', ['Whl1h5WkqSdxqnRiKW5Y8nrfd8A3'])

      // subscription นี้จะเกิด callback กับทุกการเปลี่ยนแปลงของ collection Food
      const unsubscribe = PromotionsCollection.onSnapshot(ss => {
        // ตัวแปร local
        const Promotions = {}

        ss.forEach(document => {
          // manipulate ตัวแปร local
          Promotions[document.id] = document.data()
        })

        // เปลี่ยนค่าตัวแปร state
        setPromotions(Promotions)
      })

      return () => {
        // ยกเลิก subsciption เมื่อ component ถูกถอดจาก dom
        unsubscribe()
      }
    });
  }, [])

  if (currentUser) {
    return <Redirect to="/member/profile" />;
  }

  return (

    <div>

      {Object.keys(Promotions).map((id) => {
        return <Col>
          <Card className="card-user">

            <p className="title">{Promotions[id].PromotionDetail}</p>
            <p className="title">{Promotions[id].PromotionCode}</p>
            <p className="title">{Promotions[id].PromotionExpire}</p>

          </Card>
        </Col>
      })}

    </div>
  );
}

export default PromoDisplay;
