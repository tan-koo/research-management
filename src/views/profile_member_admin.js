import React, { useState, useEffect, useContext } from 'react';
import firebaseApp from '../firebase.js';
import { Redirect, useHistory } from 'react-router-dom'
import { AuthContext } from "components/Auth/Auth.js";
import { useLocation } from "react-router-dom";
import allmember from "views/all_member_admin.js";
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


function Dashboard() {

  const [User, setUser] = useState({})
  const [Promotions, setPromotions] = useState({})
  const [UserDoc, setUserDoc] = useState('')
  const [UserRandomlist, setUserRandomlist] = useState({})
  const [Food, setFood] = useState({})

  var today = new Date()
  const now = today.getFullYear() + '-' + ("0" + (today.getMonth() + 1)).slice(-2) + '-' + ("0" + today.getDate()).slice(-2);

  const { currentUser } = useContext(AuthContext);

  const location = useLocation();

  const history = useHistory()

  const [all, setall] = useState("");
  const [writer, setwriter] = useState([]);
  const [name, setname] = useState("");
  const [journal, setjournal] = useState("");
  const [year, setyear] = useState("");
  const [quartile, setquartile] = useState("");
  const [factor, setfactor] = useState("");

  const [allWriter, setallWriter] = useState("");

  const Split = () => {
    var subData = all.split(", ");
    var writers = [];
    var text = "";
    // console.log(subData[1].length)

    for (let i = 0; i < subData.length; i++) {
      if (subData[i].split(" ").length - 1 == 1) {
        writers.push(subData[i]);
      }
    }
    // console.log(writer.length)

    for (let i = 0; i < writers.length; i++) {
      if (i == writers.length - 1) {
        text = text + writers[i];
      }
      if (i < writers.length - 1) {
        text = text + writers[i] + ", ";
      }
    }

    setwriter(writers);
    setallWriter(text);
    setname(subData[writers.length]);
    setjournal(subData[writers.length + 1]);
    setyear(subData[writers.length + 2]);

    // console.log(writer)      // ทดสอบ print ข้อมูลใน writer
  };

  // ประกาศตัวแปรเพื่ออ้างอิง user collection
  const db = firebaseApp.firestore();
  const researchCollection = db.collection("research");

  async function insertDocument() {
    // insert และคืน document reference
    const documentRef = await researchCollection.add({
      writer,
      name,
      journal,
      year,
      quartile,
      factor,
    });

    // ใช้ document reference เข้าถึงค่า document id
    alert(`New document has been inserted as ${documentRef.id}`);

    window.location.reload(false);
  }

  useEffect(() => {
    //ใช้ firebaseApp.auth().onAuthStateChanged เพื่อใช้ firebaseApp.auth().currentUser โดยไม่ติด error เมื่อทำการ signout
    firebaseApp.auth().onAuthStateChanged(user => {
      const db = firebaseApp.firestore()
      const userCollection = db.collection('User').where('Uid', '==', location.search.substring(1))

      // subscription นี้จะเกิด callback กับทุกการเปลี่ยนแปลงของ collection Food
      const unsubscribe = userCollection.onSnapshot(ss => {
        // ตัวแปร local
        const User = {}

        ss.forEach(document => {
          // manipulate ตัวแปร local
          User[document.id] = document.data()
        })

        // เปลี่ยนค่าตัวแปร state
        setUser(User)
      })

      return () => {
        // ยกเลิก subsciption เมื่อ component ถูกถอดจาก dom
        unsubscribe()
      }
    });
  }, [])

  useEffect(() => {
    //ใช้ firebaseApp.auth().onAuthStateChanged เพื่อใช้ firebaseApp.auth().currentUser โดยไม่ติด error เมื่อทำการ signout
    firebaseApp.auth().onAuthStateChanged(user => {
      const db = firebaseApp.firestore()
      const PromotionsCollection = db.collection('Promotions').where('Uid', 'array-contains-any', [location.search.substring(1), 'ALL'])

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

  useEffect(() => {
    //ใช้ firebaseApp.auth().onAuthStateChanged เพื่อใช้ firebaseApp.auth().currentUser โดยไม่ติด error เมื่อทำการ signout
    firebaseApp.auth().onAuthStateChanged(user => {
      const db = firebaseApp.firestore()
      const userCollection = db.collection('User').where('Uid', '==', location.search.substring(1))

      // subscription นี้จะเกิด callback กับทุกการเปลี่ยนแปลงของ collection Food
      const unsubscribe = userCollection.onSnapshot(ss => {
        // ตัวแปร local
        const User = {}
        const UserDoc = []
        const UserData = []

        ss.forEach(document => {
          // manipulate ตัวแปร local
          User[document.id] = document.data()
          UserData.push(User[document.id])
          UserDoc.push(document.id)
        })
        console.log(UserData[0].RandomList)
        const Lenght = UserData[0].RandomList['length'] - 1
        const RandomlistSort = {}
        const count = 0
        for (var i = Lenght; i >= 0; i--) {
          RandomlistSort[Lenght - i] = UserData[0].RandomList[i]
        }
        setUserRandomlist(RandomlistSort)
        setUserDoc(UserDoc[0])
      })

      return () => {
        // ยกเลิก subsciption เมื่อ component ถูกถอดจาก dom
        unsubscribe()
      }
    });
  }, [])

  const routeChange = () => {
    history.push("/admin/member");
  }

  if (currentUser) {
    return <Redirect to="/member/profile" />;
  }

  if (!currentUser) {
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
                <h3>Research</h3>
              </CardTitle>
              <Row>
                <Col md="12">
                  <FormGroup>
                    <p>Author</p>
                    {Object.keys(writer).map((id) => {
                      return (
                        <Col md="12">
                          <Row>
                            <p></p>
                          </Row>
                          <br></br>
                        </Col>
                      );
                    })}
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

export default Dashboard;
