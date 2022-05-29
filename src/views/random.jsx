/*!

=========================================================
* Paper Dashboard React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useState, useEffect, useContext } from 'react';
import firebaseApp from '../firebase.js';
import { Redirect } from 'react-router-dom'
import { AuthContext } from "components/Auth/Auth.js";
import Carousel from 'react-bootstrap/Carousel'
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
} from "reactstrap";
import {
  AwesomeButton,
  AwesomeButtonProgress,
  AwesomeButtonSocial,
} from 'react-awesome-button';

function Random(){ 

  const { currentUser } = useContext(AuthContext);
  const [ Food, setFood ] = useState({})
  const [ FoodID, setFoodID ] = useState({})
  const [ NRandom, setNRandom ] = useState(0)
  const [ NConfirm, setConfirm ] = useState(0)
  const [ RDFoodID, setRDFoodID ] = useState('unknown')
  const [ RDFoodIDCheck, setRDFoodIDCheck ] = useState(-1)
  const [ loading, setLoading ] = useState(false)
  const [ UserDoc, setUserDoc] = useState('')
  const [ UserRandomlist, setUserRandomlist] = useState({})
  const [ FoodInterest, setFoodInterest] = useState(0)

  useEffect(() => {
    //ใช้ firebaseApp.auth().onAuthStateChanged เพื่อใช้ firebaseApp.auth().currentUser โดยไม่ติด error เมื่อทำการ signout
    firebaseApp.auth().onAuthStateChanged(user => {

      const db = firebaseApp.firestore()
      const FoodCollection = db.collection('Food2')

      // subscription นี้จะเกิด callback กับทุกการเปลี่ยนแปลงของ collection Food
      const unsubscribe = FoodCollection.onSnapshot(ss => {
          // ตัวแปร local
          const FoodID = []

          ss.forEach(document => {
              // manipulate ตัวแปร local
              Food[document.id] = document.data()
              FoodID.push(document.id)
          })

          // เปลี่ยนค่าตัวแปร state
          setFoodID(FoodID)
          
      })

      return () => {
          // ยกเลิก subsciption เมื่อ component ถูกถอดจาก dom
          unsubscribe()
      }
      });
  }, [RDFoodID])

  useEffect(() => {
    //ใช้ firebaseApp.auth().onAuthStateChanged เพื่อใช้ firebaseApp.auth().currentUser โดยไม่ติด error เมื่อทำการ signout
    firebaseApp.auth().onAuthStateChanged(user => {

      const db = firebaseApp.firestore()
      const FoodCollection = db.collection('Food2').where('__name__', '==' , RDFoodID) 

      // subscription นี้จะเกิด callback กับทุกการเปลี่ยนแปลงของ collection Food
      const unsubscribe = FoodCollection.onSnapshot(ss => {
          // ตัวแปร local
          const Food = {}

          ss.forEach(document => {
              // manipulate ตัวแปร local
              Food[document.id] = document.data()
          })

          // เปลี่ยนค่าตัวแปร state
          setFood(Food)
          setLoading(false)
      })

      return () => {
          // ยกเลิก subsciption เมื่อ component ถูกถอดจาก dom
          unsubscribe()
      }
      });
  }, [RDFoodID])

  if(document.getElementById("RD") != null && document.getElementById("RDN") != null){
    if(RDFoodID == 'unknown'){
      document.getElementById("RD").style.display = 'inline';
    } else {
      document.getElementById("RDN").style.display = 'inline';
      document.getElementById("RD").style.display = 'none';
    }
  }


  function RDFood() {
            
    setLoading(true)
    var rd = Math.floor(Math.random() * FoodID.length) 
    if(FoodID.length > 1){           
      for(var i=0; rd == RDFoodIDCheck; i++){
            rd = Math.floor(Math.random() * FoodID.length)              
      }
    }
    setRDFoodIDCheck(rd)
    setRDFoodID(FoodID[rd])
    console.log('rd'+rd)
    console.log('rdc'+RDFoodIDCheck)
    N_Random()
    
  }

  async function Addlist(id){
      alert('ระบบได้ทำการบันทึกประวัติแล้ว')
      setRDFoodID('unknown')
      FoodInteresting(id)
      N_Confirm()
  }

  async function FoodInteresting(id){
    const db = firebaseApp.firestore()
    const FoodCollection = db.collection('Food2').where('__name__', '==' , id)
    // subscription นี้จะเกิด callback กับทุกการเปลี่ยนแปลงของ collection Food
    const unsubscribe = FoodCollection.onSnapshot(ss => {
      // ตัวแปร local
      const FoodData = []
      ss.forEach(document => {
          // manipulate ตัวแปร local
          Food[document.id] = document.data()
          FoodData.push(Food[document.id].Interesting)
      })  
      })
      const res2 = await db.collection('Food2').doc(id).update({
        'Interesting': Food[id].Interesting+1
      });
  }

  useEffect(() => {
    //ใช้ firebaseApp.auth().onAuthStateChanged เพื่อใช้ firebaseApp.auth().currentUser โดยไม่ติด error เมื่อทำการ signout
    firebaseApp.auth().onAuthStateChanged(user => {
      const db = firebaseApp.firestore()
      const DBCollection = db.collection('Dashboard')
      // subscription นี้จะเกิด callback กับทุกการเปลี่ยนแปลงของ collection Food
      const unsubscribe = DBCollection.onSnapshot(ss => {
        // ตัวแปร local
        const DB = {}
        ss.forEach(document => {
            // manipulate ตัวแปร local
            DB['RandomFood'] = document.data()
        }) 
          setNRandom(DB.RandomFood.N_Random)
          setConfirm(DB.RandomFood.N_Confirm)
        })

      return () => {
          // ยกเลิก subsciption เมื่อ component ถูกถอดจาก dom
          unsubscribe()
      }
      });
  }, [NRandom, NConfirm])

  async function N_Random(){
    const db = firebaseApp.firestore()
      const res2 = await db.collection('Dashboard').doc('RandomFood').update({
        'N_Random': NRandom+1
      });
  }

  async function N_Confirm(){
    const db = firebaseApp.firestore()
      const res2 = await db.collection('Dashboard').doc('RandomFood').update({
        'N_Confirm': NConfirm+1
      });
  }

  if (currentUser) {
      return <Redirect to="/member/random" />;
  }

    return (
      <>
     <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
       
        }}className="content">
        <Col md="4">
              <Card className="card-user">
                <CardHeader  style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
       
        }}className="content">
                 
                </CardHeader>
                <CardBody id='RD' style={{ display: 'none'}}>
                  <Form >
                  <CardTitle style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
       
        }}className="content"><h2>มื้อนี้กินอะไรดี ?</h2></CardTitle>
                  <Row>
                      <Col md="12">
                      <img
                 alt="..."
                 src="https://res.cloudinary.com/daxwfdlwj/image/upload/v1620030749/Food/giphy_w79qht.gif"
                 
               />
                    
                      </Col>
                    </Row>
                    <Row>
                      <Col md="12">
                
                  
                      </Col>
                    </Row>
                 
                    <Row>
               
                    </Row>
            
                    <Row>
                      <div className="update ml-auto mr-auto">
                        <Button
                          className="btn23"
                          color="red"
                          onClick={RDFood}
                          
                        >
                        สุ่มอาหาร
                        </Button>
                      </div>
                    </Row>
                  </Form>
                  
       
                </CardBody>
        { Object.keys(Food).map((id) => {  
          return<CardBody id='RDN' style={{ display: 'none'}}>
                  <Form >
                  <CardTitle style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
       
        }}className="content"><h2>{Food[id].name}</h2></CardTitle>
                  <Row>
                      <Col md="12">

                      <img alt="..." src={Food[id].image} style={{ width : '250px', height: '250px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}/>

                    
                      </Col>
                    </Row>
                    <Row>
                      <Col md="12">
                
                  
                      </Col>
                    </Row>
                 
                    <Row>
               
                    </Row>
            
                    <Row>
                    <div className="update ml-auto mr-auto">
                        <Button
                          className="btn23"
                          color="warning"
                          onClick={RDFood}
                          
                        >
                        สุ่มใหม่
                        </Button>
                      </div>
                      <div className="update ml-auto mr-auto">
                        <Button
                          className="btn23"
                          color="success"
                          value={id} onClick={e =>Addlist(e.target.value)}
                          
                        >
                        ยืนยัน
                        </Button>
                      </div>
                    </Row>
                  </Form>
                  
       
                </CardBody>
          }) }
              </Card>
            </Col>

           

        </div>
        
      </>
    );
}

export default Random;
