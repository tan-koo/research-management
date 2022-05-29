import React, { useState, useEffect, useContext } from 'react';
import firebaseApp from '../firebase.js';
import { Redirect } from 'react-router-dom'
import { AuthContext } from "components/Auth/Auth.js";
import { Link } from 'react-router-dom';
import { Line, Pie } from "react-chartjs-2";
// reactstrap components
import { Col, Card, Row } from "react-bootstrap";
import {
  Button,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  FormGroup,
  Form,
  Input,
  InputGroup,
  InputGroupText,
  InputGroupAddon,

} from "reactstrap";

// core components
import {
  dashboard24HoursPerformanceChart,
  dashboardEmailStatisticsChart,
  dashboardNASDAQChart,
} from "variables/charts.js";


function Seemore() {

  const [User, setUser] = useState({})
  const [Promotions, setPromotions] = useState({})
  const [UserDoc, setUserDoc] = useState('')
  const [UserRandomlist, setUserRandomlist] = useState([])
  const [Food, setFood] = useState({})
  const [RecomList, setRecomList] = useState({})
  const [FoodId, setFoodId] = useState([])
  const [writer, setwriter] = useState([]);

  var today = new Date()
  const now = today.getFullYear() + '-' + ("0" + (today.getMonth() + 1)).slice(-2) + '-' + ("0" + today.getDate()).slice(-2);

  const { currentUser } = useContext(AuthContext);

  // useEffect(() => {
  //   //ใช้ firebaseApp.auth().onAuthStateChanged เพื่อใช้ firebaseApp.auth().currentUser โดยไม่ติด error เมื่อทำการ signout
  //   firebaseApp.auth().onAuthStateChanged(user => {
  //     const db = firebaseApp.firestore()
  //     const userCollection = db.collection('User').where('Uid', '==', firebaseApp.auth().currentUser.uid)

  //     // subscription นี้จะเกิด callback กับทุกการเปลี่ยนแปลงของ collection Food
  //     const unsubscribe = userCollection.onSnapshot(ss => {
  //       // ตัวแปร local
  //       const User = {}

  //       ss.forEach(document => {
  //         // manipulate ตัวแปร local
  //         User[document.id] = document.data()
  //       })

  //       // เปลี่ยนค่าตัวแปร state
  //       setUser(User)
  //     })

  //     return () => {
  //       // ยกเลิก subsciption เมื่อ component ถูกถอดจาก dom
  //       unsubscribe()
  //     }
  //   });
  // }, [])

  // useEffect(() => {
  //   //ใช้ firebaseApp.auth().onAuthStateChanged เพื่อใช้ firebaseApp.auth().currentUser โดยไม่ติด error เมื่อทำการ signout
  //   firebaseApp.auth().onAuthStateChanged(user => {
  //     const db = firebaseApp.firestore()
  //     const PromotionsCollection = db.collection('Promotions').where('Uid', 'array-contains-any', [firebaseApp.auth().currentUser.uid, 'ALL'])

  //     // subscription นี้จะเกิด callback กับทุกการเปลี่ยนแปลงของ collection Food
  //     const unsubscribe = PromotionsCollection.onSnapshot(ss => {
  //       // ตัวแปร local
  //       const Promotions = {}

  //       ss.forEach(document => {
  //         // manipulate ตัวแปร local
  //         Promotions[document.id] = document.data()
  //       })

  //       // เปลี่ยนค่าตัวแปร state
  //       setPromotions(Promotions)
  //     })

  //     return () => {
  //       // ยกเลิก subsciption เมื่อ component ถูกถอดจาก dom
  //       unsubscribe()
  //     }
  //   });
  // }, [])

  // useEffect(() => {
  //   //ใช้ firebaseApp.auth().onAuthStateChanged เพื่อใช้ firebaseApp.auth().currentUser โดยไม่ติด error เมื่อทำการ signout
  //   firebaseApp.auth().onAuthStateChanged(user => {
  //     const db = firebaseApp.firestore()
  //     const userCollection = db.collection('User').where('Uid', '==', firebaseApp.auth().currentUser.uid)

  //     // subscription นี้จะเกิด callback กับทุกการเปลี่ยนแปลงของ collection Food
  //     const unsubscribe = userCollection.onSnapshot(ss => {
  //       // ตัวแปร local
  //       const User = {}
  //       const UserDoc = []
  //       const UserData = []

  //       ss.forEach(document => {
  //         // manipulate ตัวแปร local
  //         User[document.id] = document.data()
  //         UserData.push(User[document.id])
  //         UserDoc.push(document.id)
  //       })
  //       //console.log(UserData[0].RandomList[1].cate[0])

  //       const Lenght = UserData[0].RandomList['length'] - 1
  //       const RandomlistSort = []
  //       const count = 0
  //       for (var i = Lenght; i >= 0; i--) {
  //         RandomlistSort[Lenght - i] = UserData[0].RandomList[i]
  //       }

  //       //console.log(RandomlistSort)

  //       setUserRandomlist(RandomlistSort)
  //       setUserDoc(UserDoc[0])
  //     })

  //     return () => {
  //       // ยกเลิก subsciption เมื่อ component ถูกถอดจาก dom
  //       unsubscribe()
  //     }
  //   });
  // }, [])

  // useEffect(() => {
  //   //ใช้ firebaseApp.auth().onAuthStateChanged เพื่อใช้ firebaseApp.auth().currentUser โดยไม่ติด error เมื่อทำการ signout
  //   firebaseApp.auth().onAuthStateChanged(user => {
  //     const db = firebaseApp.firestore()
  //     const userCollection = db.collection('User').where('Uid', '==', firebaseApp.auth().currentUser.uid)

  //     const FoodId = []

  //     const unsubscribe = userCollection.onSnapshot(ss => {
  //       // ตัวแปร local
  //       const User = {}
  //       const UserRD = []

  //       ss.forEach(document => {
  //         // manipulate ตัวแปร local
  //         User[document.id] = document.data()
  //         UserRD.push(User[document.id].RandomList)
  //       })
  //       var UserRDCate = []
  //       for (var i = 0; i < UserRD[0].length; i++) {
  //         UserRDCate = UserRDCate.concat(UserRD[0][i].name)
  //       }

  //       const FoodCollection = db.collection('Food2').orderBy('Interesting')

  //       // subscription นี้จะเกิด callback กับทุกการเปลี่ยนแปลงของ collection Food
  //       const unsubscribe = FoodCollection.onSnapshot(ss => {
  //         // ตัวแปร local
  //         const Food = {}

  //         ss.forEach(document => {
  //           // manipulate ตัวแปร local
  //           Food[document.id] = document.data()
  //           FoodId.push(document.id)
  //         })

  //         //console.log(FoodId.length)
  //         //if(UserRandomlist.length > 0) {console.log(UserRandomlist[1].name)}
  //         let count = 0
  //         const RecomData = []

  //         if (UserRandomlist.length > 0) {
  //           for (let i = 0; i < 3; i++) {                                                 // คิดจาก 3 เมนูล่าสุดใน random list
  //             for (let j = 0; j < 4; j++) {                                               // คิดเฉพาะ category 4 ตัว
  //               for (let k = 0; k < FoodId.length; k++) {                                 // ไล่หา food ทีละตัว 
  //                 if (Food[FoodId[k]].name.indexOf(UserRandomlist[i].cate[j]) !== -1) {   // ถ้ามี category อยู่ในชื่ออาหาร
  //                   if (RecomData.includes(Food[FoodId[k]]) == false || Food[FoodId[k]].name.includes(UserRDCate) == false) {
  //                     if (RecomData.length < 3) {
  //                       RecomData[count] = Food[FoodId[k]]                                    // เก็บชื่ออาหารลง recommend list
  //                       count = count + 1
  //                     }

  //                   }
  //                 }
  //               }
  //             }
  //           }
  //         }

  //         //if (RecomData.length > 0) { console.log(RecomData) }

  //         // เปลี่ยนค่าตัวแปร state
  //         setRecomList(RecomData)
  //         setFoodId(FoodId)
  //         setFood(Food)
  //       })
  //     })

  //     return () => {
  //       // ยกเลิก subsciption เมื่อ component ถูกถอดจาก dom
  //       unsubscribe()
  //     }
  //   });
  // }, [UserRandomlist])



  // if (!currentUser) {
  //   return <Redirect to="/general/login" />;
  // }

  if (currentUser) {
    var ExpiredCoupon = firebaseApp.firestore().collection('Promotions').where("PromotionExpire", "<=", now);
    ExpiredCoupon.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        doc.ref.delete();
      });
    });
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      className="content"
    >
      <Col md="8">
        <Card className="card-user">
          <CardBody>
            <Form>
              <CardTitle
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                className="content"
              >
                <h3>Seemore</h3>
              </CardTitle>
              <Row>
                <Col md="12">
                  <FormGroup>
                    <p>Author</p>
                        <Col md="12">
                          <Row>
                            <p></p>
                          </Row>
                          <br></br>
                        </Col>
                    <br></br>

                    <p>Title</p>
                    <p></p>
                    <br></br>

                    <p>Journal</p>
                    <p></p>
                    <br></br>

                    <p>Year</p>
                    <p></p>
                    <br></br>

                    <p>Quartile</p>
                    <p></p>
                    <br></br>

                    <p>Impact Factor</p>
                    <p></p>
                    <br></br>

                    <p>File</p>
                    <p></p>
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <div className="update ml-auto mr-auto">
                  <Button
                    classname="btn btn-"
                    color="danger"
                  >
                    Back
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

export default Seemore;