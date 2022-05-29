
import React, { useState, useEffect, useContext } from 'react';
import firebaseApp from '../firebase.js';
import { Redirect } from 'react-router-dom'
import { AuthContext } from "components/Auth/Auth.js";
import { Link } from 'react-router-dom';
import { Line, Pie } from "react-chartjs-2";
// reactstrap components
import { Col, Card, Row } from "react-bootstrap";
import {
  Button, CardHeader, CardBody, CardFooter, CardTitle,
  FormGroup, Form, Input, InputGroup, InputGroupText,
  InputGroupAddon, Modal, ModalHeader, ModalBody, ModalFooter
} from "reactstrap";

// core components
import {
  dashboard24HoursPerformanceChart, dashboardEmailStatisticsChart, dashboardNASDAQChart
} from "variables/charts.js";


function Dashboard() {

  const [User, setUser] = useState({})
  const [Promotions, setPromotions] = useState({})
  const [UserDoc, setUserDoc] = useState('')
  const [UserRandomlist, setUserRandomlist] = useState([])
  const [Food, setFood] = useState({})
  const [RecomList, setRecomList] = useState({})
  const [FoodId, setFoodId] = useState([])

  const [idDoc, setIdDoc] = useState('')
  const [imgData, setImgData] = useState(null);
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [education, setEducation] = useState([])
  const [userUid, setUserUid] = useState('')
  const [modalShow, setModalShow] = useState(false)

  var today = new Date()
  const now = today.getFullYear() + '-' + ("0" + (today.getMonth() + 1)).slice(-2) + '-' + ("0" + today.getDate()).slice(-2);

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    //ใช้ firebaseApp.auth().onAuthStateChanged เพื่อใช้ firebaseApp.auth().currentUser โดยไม่ติด error เมื่อทำการ signout
    firebaseApp.auth().onAuthStateChanged(user => {
      const db = firebaseApp.firestore()
      const userRef = db.collection('User').where('Uid', '==', firebaseApp.auth().currentUser.uid)

      // subscription นี้จะเกิด callback กับทุกการเปลี่ยนแปลงของ collection Food
      const unsubscribe = userRef.onSnapshot(ss => {
        // ตัวแปร local
        const User = {}
        let uid = ''

        ss.forEach(document => {
          // manipulate ตัวแปร local
          User[document.id] = document.data()
          uid = document.data().Uid
        })

        // เปลี่ยนค่าตัวแปร state
        setUser(User)
        setUserUid(uid)
      })

      return () => {
        // ยกเลิก subsciption เมื่อ component ถูกถอดจาก dom
        unsubscribe()
      }
    });
  }, [])

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
  //       // console.log(UserData[0].RandomList[1].cate[0])

  //       const Lenght = UserData[0].RandomList['length'] - 1
  //       const RandomlistSort = []
  //       const count = 0
  //       for (var i = Lenght; i >= 0; i--) { RandomlistSort[Lenght - i] = UserData[0].RandomList[i] }

  //       // console.log(RandomlistSort)

  //       setUserRandomlist(RandomlistSort)
  //       setUserDoc(UserDoc[0])
  //     })

  //     return () => {
  //       // ยกเลิก subsciption เมื่อ component ถูกถอดจาก dom
  //       unsubscribe()
  //     }
  //   });
  // }, [])

  if (currentUser) {
    var ExpiredCoupon = firebaseApp.firestore().collection('Promotions').where("PromotionExpire", "<=", now);
    ExpiredCoupon.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        doc.ref.delete();
      });
    });
  } else if (!currentUser) { return <Redirect to="/general/login" />; }

  const db = firebaseApp.firestore();
  const profileRef = db.collection("Profile");

  async function insertDocument() {
    if (firstName !== "" && lastName !== "" && education !== "") {
      // insert และคืน document reference
      const documentRef = await profileRef.add({
        firstName,
        lastName,
        education,
        userUid
      });

      alert(`Successful`);

      window.location.reload(false);

      window.location.href = "/member/profile";
    } else { alert(`Please fill in the blanks.`); }
  }

  const updateData = (index, e) => {
    let newArr = education
    newArr[index] = e

    setEducation(newArr);
  }

  const editDoc = (id) => {
    setIdDoc(id)
    setModalShow(true)
    setEducation(User[id].Education)

    // setName(Research[id].name)
    // setWriter(Research[id].writer)
    // setJournal(Research[id].journal)
    // setYear(Research[id].year)
    // setQuartile(Research[id].quartile)
    // setFactor(Research[id].factor)
  }

  const editSubmit = async () => {

    const db = firebaseApp.firestore()
    const userRef = db.collection('User')

    const res = await userRef.doc(idDoc).update({
      FirstName: firstName,
      LastName: lastName,
      Education: education,
      Pic: imgData
    });

    alert(`successful`)

    setModalShow(false)
  }

  const onChangePicture = (e) => {
    if (e.target.files[0]) {
      console.log("picture: ", e.target.files[0]);
      // setPicture(e.target.files[0]);

      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgData(reader.result);
        // console.log(reader.result)
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }} className="content">
      <Col md="8">
        {Object.keys(User).map((id) => {
          return <Col md="12">
            <Card className="card-user">
              {/* <div className="image">
                  <img alt="..." src="https://sv1.picz.in.th/images/2022/04/27/8msXze.jpg" />
                </div> */}
              <CardBody>
                <div className="author">
                  <div>
                    {/* <img alt="..." className="avatar border-gray"
                      src={User[id].Pic} /> */}
                    <img src={User[id].Pic} />
                    <h5 className="title mt-3">{User[id].FirstName} {User[id].LastName}</h5>
                  </div>
                  <p className="description">{User[id].Email}</p>
                </div>
                <Col md="12" className='mt-1'>
                  <h6>Education</h6>
                  {Object.keys(User[id].Education).map((id2) => {
                    return <p>{User[id].Education[id2]}</p>;
                  })}
                  {/* <p>B.Sc.(Math. Education), Prince of Songkla University Thailand</p>
                  <p>M.Sc.(Applied. Mathematics),King Mongkut's University of Technology Thonburi ,Thailand</p>
                  <p>Ph.D.(Applied Mathematics),University of Exeter, UK)</p> */}
                </Col>
                <div className="button-container">
                  <Button onClick={() => editDoc(id)} class="btn btn" color="info" className='mr-1'>
                    Edit Profile
                  </Button>
                  <Button onClick={() => firebaseApp.auth().signOut()}
                    class="btn btn" color="danger" className='ml-1'>
                    Log Out
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>
        })}
      </Col>

      <Modal isOpen={modalShow} size="lg" className="modal-seemore">
        <ModalHeader>Edit Profile</ModalHeader>
        <ModalBody>
          {Object.keys(User).map((id) => {
            return <FormGroup>
              <Row>
                <Col md='4'>
                  <p>Image</p>
                  <Input id="profilePic" type="file" onChange={onChangePicture} />
                </Col>
                <Col md='4'>
                  <p>First Name</p>
                  <Input type="text" pattern="^[ก-๏\sa-zA-Z\s]+$" defaultValue={User[id].FirstName}
                    onChange={(e) => setFirstName(e.target.value)}></Input>
                </Col>
                <Col md='4'>
                  <p>Last Name</p>
                  <Input type="text" pattern="^[ก-๏\sa-zA-Z\s]+$" defaultValue={User[id].LastName}
                    onChange={(e) => setLastName(e.target.value)}></Input>
                </Col>
              </Row>
              <br></br>
              <p>Education</p>
              {Object.keys(User[id].Education).map((id2) => {
                return (
                  <Col md="12">
                    <Row>
                      <Input type='text' onChange={(e) => updateData(id2, e.target.value)}
                        defaultValue={User[id].Education[id2]} ></Input>
                    </Row>
                    <br></br>
                  </Col>
                );
              })}
              {/* <Input type="textarea"
              onChange={(e) => setEducation(e.target.value)}></Input> */}
              {/* <p>Publications</p>
            <Input type="textarea"></Input> */}
            </FormGroup>
          })}
        </ModalBody>
        <ModalFooter>
          <Button className="btn mr-1" color="info" onClick={() => setModalShow(false)}>Close</Button>
          <Button className="btn ml-1" color="danger" onClick={() => editSubmit()}>Apply</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default Dashboard;