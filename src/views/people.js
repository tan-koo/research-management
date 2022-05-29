
import React, { useState, useEffect, useContext } from 'react';
import firebaseApp from '../firebase.js';
import { Redirect, Link } from 'react-router-dom'
import { BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom'
import { AuthContext } from "components/Auth/Auth.js";
import profile from "views/profile_member_admin.js";

import Popup from "views/Popup.js";
// reactstrap components
import {
  Button, Card, CardHeader, CardBody, CardFooter,
  CardTitle, FormGroup, Form, Input, Row,
  Col, Table, Modal, ModalHeader, ModalBody,
  ModalFooter
} from "reactstrap";
import Carousel from 'react-bootstrap/Carousel'

const Member = () => {
  let no = 0

  const db = firebaseApp.firestore()
  const PromotionsCollection = db.collection('Promotions')
  const [isOpen, setIsOpen] = useState(false);

  // const togglePopup = (Uid, FName) => {
  //   setIsOpen(!isOpen);
  //   setCurrentUid(Uid)
  //   setCurrentFname(FName)
  // }

  const [User, setUser] = useState({})
  const [pic, setPic] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [uid, setUid] = useState('')
  const [education, setEducation] = useState([])
  const [Research, setResearch] = useState([])
  const [userResearch, setUserResearch] = useState([])

  const [name, setName] = useState('')
  const [writer, setWriter] = useState([])
  const [journal, setJournal] = useState('')
  const [year, setYear] = useState('')
  const [quartile, setQuartile] = useState('')
  const [factor, setFactor] = useState('')

  const [seeMoreModalShow, setSeeMoreModalShow] = useState(false)
  const [editModalShow, setEditModalShow] = useState(false)
  const [delModalShow, setDelModalShow] = useState(false)

  const [idDoc, setIdDoc] = useState('')

  const history = useHistory()

  const { currentUser } = useContext(AuthContext);

  // useEffect(() => {
  //   //ใช้ firebaseApp.auth().onAuthStateChanged เพื่อใช้ firebaseApp.auth().currentUser โดยไม่ติด error เมื่อทำการ signout
  //   firebaseApp.auth().onAuthStateChanged(user => {
  //     const db = firebaseApp.firestore()
  //     const userRef = db.collection('User').where('Uid', '==', firebaseApp.auth().currentUser.uid)

  //     // subscription นี้จะเกิด callback กับทุกการเปลี่ยนแปลงของ collection Food
  //     const unsubscribe = userRef.onSnapshot(ss => {
  //       // ตัวแปร local
  //       const User = {}

  //       ss.forEach(document => {
  //         // manipulate ตัวแปร local
  //         User[document.id] = document.data()
  //         setUserMeRole(User[document.id].Role)
  //       })

  //       // เปลี่ยนค่าตัวแปร state
  //       setUserMe(User)
  //     })

  //     return () => {
  //       // ยกเลิก subsciption เมื่อ component ถูกถอดจาก dom
  //       unsubscribe()
  //     }
  //   });
  // }, [])

  useEffect(() => {
    //ใช้ firebaseApp.auth().onAuthStateChanged เพื่อใช้ firebaseApp.auth().currentUser โดยไม่ติด error เมื่อทำการ signout
    firebaseApp.auth().onAuthStateChanged(user => {
      const db = firebaseApp.firestore()
      const researchRef = db.collection('research')

      // subscription นี้จะเกิด callback กับทุกการเปลี่ยนแปลงของ collection Food
      const unsubscribe = researchRef.onSnapshot(ss => {
        // ตัวแปร local
        const Research = []

        ss.forEach(document => {
          // manipulate ตัวแปร local
          Research.push(document.data())
        })

        // เปลี่ยนค่าตัวแปร state
        setResearch(Research)
      })

      return () => {
        // ยกเลิก subsciption เมื่อ component ถูกถอดจาก dom
        unsubscribe()
      }
    });
  }, [])

  // useEffect(() => {
  //   //ใช้ firebaseApp.auth().onAuthStateChanged เพื่อใช้ firebaseApp.auth().currentUser โดยไม่ติด error เมื่อทำการ signout
  //   firebaseApp.auth().onAuthStateChanged(research => {
  //     const db = firebaseApp.firestore()
  //     const researchRef = db.collection('research')

  //     // subscription นี้จะเกิด callback กับทุกการเปลี่ยนแปลงของ collection Food
  //     const unsubscribe = researchRef.onSnapshot(ss => {
  //       // ตัวแปร local
  //       const Research = {}

  //       ss.forEach(document => {
  //         // manipulate ตัวแปร local
  //         Research[document.id] = document.data()
  //       })

  //       // เปลี่ยนค่าตัวแปร state
  //       setResearch(Research)
  //       console.log(Research)
  //     })

  //     return () => {
  //       // ยกเลิก subsciption เมื่อ component ถูกถอดจาก dom
  //       unsubscribe()
  //     }
  //   });
  // }, [])

  useEffect(() => {
    //ใช้ firebaseApp.auth().onAuthStateChanged เพื่อใช้ firebaseApp.auth().currentUser โดยไม่ติด error เมื่อทำการ signout
    firebaseApp.auth().onAuthStateChanged(user => {
      const db = firebaseApp.firestore()
      const userCollection = db.collection('User')

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

  const AllUid = [];

  function GetAllUid(e) { AllUid.push(e) }

  // async function AddPromotion() {
  //   const Uid = [];
  //   Uid.push(CurrentUid)
  //   // insert และคืน document reference
  //   const documentRef = await PromotionsCollection.add({

  //     PromotionDetail,
  //     PromotionCode,
  //     PromotionExpire,
  //     Uid,

  //   })

  //   // ใช้ document reference เข้าถึงค่า document id
  //   alert(`new document has been inserted as ${documentRef.id}`)
  //   setPromotionDetail('')
  //   setPromotionCode('')
  //   setPromotionExpire('')
  // }

  // async function AddPromotionALL() {
  //   const Uid = AllUid;
  //   // insert และคืน document reference
  //   const documentRef = await PromotionsCollection.add({

  //     PromotionDetail,
  //     PromotionCode,
  //     PromotionExpire,
  //     Uid,

  //   })

  //   // ใช้ document reference เข้าถึงค่า document id
  //   alert(`new document has been inserted as ${documentRef.id}`)
  //   setPromotionDetail('')
  //   setPromotionCode('')
  //   setPromotionExpire('')
  // }

  // const routeChange = (e) => {
  //   history.push({
  //     pathname: '/admin/member/profile',
  //     search: e,
  //     state: { detail: e }
  //   });
  // }

  // if (currentUser) { return <Redirect to="/member/profile" />; }

  const goToInsert = () => { window.location.href = "/member/insert"; }
  // const goToHome = () => { window.location.href = "/member/home"; }

  function delDocModal(id) {
    setIdDoc(id)
    setDelModalShow(true)
  }

  function delDoc() {
    const db = firebaseApp.firestore()
    const researchRef = db.collection('research')

    // ประกาศตัวแปรเพื่ออ้างอิงไปยัง document ที่จะทำการลบ
    const documentRef = researchRef.doc(idDoc)
    // ลบ document
    documentRef.delete()

    // alert(`Deleted`)
    setDelModalShow(false)
  }

  function seeDocModal(id) {
    let userResearch = []

    for (let i = 0; i < Research.length; i++) {
      if (Research[i].userUid == User[id].Uid) { userResearch.push(Research[i]) }
    }

    setIdDoc(id)
    setSeeMoreModalShow(true)

    setPic(User[id].Pic)
    setFirstName(User[id].FirstName)
    setLastName(User[id].LastName)
    setEducation(User[id].Education)
    setUserResearch(userResearch)

    // setName(Research[id].name)
    // setWriter(Research[id].writer)
    // setJournal(Research[id].journal)
    // setYear(Research[id].year)
    // setQuartile(Research[id].quartile)
    // setFactor(Research[id].factor)
  }

  function editDocModal(id) {
    setIdDoc(id)
    setEditModalShow(true)

    setName(Research[id].name)
    setWriter(Research[id].writer)
    setJournal(Research[id].journal)
    setYear(Research[id].year)
    setQuartile(Research[id].quartile)
    setFactor(Research[id].factor)
  }

  const updateData = (index, e) => {
    let newArr = writer
    newArr[index] = e

    setWriter(newArr);
  }

  const editSubmit = async () => {

    const db = firebaseApp.firestore()
    const researchRef = db.collection('research')

    const res = await researchRef.doc(idDoc).update({
      name: name,
      writer: writer,
      journal: journal,
      year: year,
      quartile: quartile,
      factor: factor
    });

    // alert(`Edited`)

    setEditModalShow(false)
  }

  function rowNumber() {
    no = no + 1
    return (<div>{no}</div>)
  }

  return (
    <div style={{ display: "flex", justifyContent: "center" }} className="content">
      <Col md="10" className="admin-insert">
        <Card className="card-user">
          <CardBody>
            <CardTitle style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <br></br>
            </CardTitle>
            <div className="insert">
              {/* <Button classname="btn btn-" color="danger" onClick={() => goToInsert()}>
                <i class="fa fa-solid fa-plus"></i>
              </Button> */}
              {/* <FormGroup>
                <Input name="select" type="select" className="input-journal pt-2 pl-3">
                  <option value="">-- Select --</option>
                  <option value="">International</option>
                  <option value="">National</option>
                </Input>
              </FormGroup> */}
            </div>
            <Table hover responsive className="table-admin mt-3">
              <thead>
                <tr>
                  <th width="50px">#</th>
                  <th width="50px">Author</th>
                  <th width="50px">Actions</th>
                </tr>
              </thead>
              {Object.keys(User).map((id) => {
                return (
                  <tbody>
                    <tr>
                      <th scope="row">{rowNumber()}</th>
                      <td>
                        {/*Object.keys(Research[id].writer).map((id2) => {
                          return <p>{Research[id].writer[id2]}</p>
                        })*/}
                        {User[id].FirstName} {User[id].LastName}
                      </td>
                      {/* <td>
                        <p>{Research[id].name}</p>
                      </td> */}
                      <td>
                        <a title class="btn btn-info btn-link btn-xs"
                          onClick={() => seeDocModal(id)}>
                          <i class="fa fa-solid fa-eye"></i>
                        </a>
                        {/* <a title class="btn btn-success btn-link btn-xs"
                          onClick={() => editDocModal(id)}>
                          <i class="fa fa-solid fa-pen"></i>
                        </a>
                        <a title class="btn btn-danger btn-link btn-xs"
                          onClick={() => delDocModal(id)}>
                          <i class="fa fa-solid fa-trash"></i>
                        </a> */}
                      </td>
                    </tr>
                  </tbody>
                );
              })}
            </Table>
          </CardBody>
        </Card>
      </Col>

      {/*(userMeRole.localeCompare('admin') !== 0) ? (
        <Modal isOpen={true} size="sm">
          <ModalHeader>Warning</ModalHeader>
          <ModalBody>Sorry, you are not admin.</ModalBody>
          <ModalFooter>
            { <button onClick={() => setDelModalShow(false)}>close</button> }
            <button onClick={() => goToHome()}>OK</button>
          </ModalFooter>
        </Modal>
      ) : null*/}

      <Modal isOpen={seeMoreModalShow} size="lg" className="modal-seemore">
        <ModalHeader>Profile Author</ModalHeader>
        <ModalBody>
          <Row>
            <Col md="5">
              <div className="image">
                <img src={pic} />
              </div>
            </Col>
            {/* <Col md="8"><h4>{firstName} {lastName}</h4></Col> */}

            <Col md="7">
              <Col md="11">
                <h4>{firstName} {lastName}</h4>
                <h6>Education</h6>
                {Object.keys(education).map((id) => {
                  return (<p>{education[id]}</p>)
                })}
                {/* <p>B.Ed.(Mathematics), Burapha University, Thailand</p>
                <p>M.Sc.(Mathematics), Chiang Mai University Thailand</p>
                <p>Ph.D.(Mathematics), Naresuan University Thailand</p> */}
                <h6>Publications</h6>
                {Object.keys(userResearch).map((id) => {
                  return (<p>- {userResearch[id].name}</p>)
                })}
                {/* <p>A new analytical approach for the research of thin-film flow of magneto hydrodynamic fluid in the presence of thermal conductivity and variable viscosity</p> */}
                {/* <p>Impacts of Thermal Radiation and Heat Consumption/Generation on Unsteady MHD Convection Flow of an Oldroyd-B Fluid with Ramped Velocity and Temperature in a Generalized Darcy Medium</p> */}
              </Col>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => setSeeMoreModalShow(false)} class="btn" color="danger">close</Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={editModalShow} size="lg" className="modal-seemore">
        <ModalHeader>Edit</ModalHeader>
        <ModalBody>

          <p>Author</p>
          {Object.keys(writer).map((id2) => {
            return (
              <Col md="12">
                <Row>
                  <Input type='text' onChange={(e) => updateData(id2, e.target.value)}
                    defaultValue={writer[id2]} ></Input>
                </Row>
                <br></br>
              </Col>
            );
          })}

          <p>Title</p>
          <Input type="textarea" value={name} onChange={(e) => setName(e.target.value)}></Input>

          <p>Journal</p>
          <Input type="textarea" onChange={e => setJournal(e.target.value)}
            defaultValue={journal}></Input>

          <p>Year</p>
          <Input onChange={e => setYear(e.target.value)} defaultValue={year}></Input>

          <p>Quartile</p>
          <select onChange={e => setQuartile(e.target.value)}>
            <option>{quartile}</option>
            <option value="Q1">Q1</option>
            <option value="Q2">Q2</option>
            <option value="Q3">Q3</option>
            <option value="Q4">Q4</option>
          </select>

          <p>Impact factor</p>
          <Input defaultValue={factor} onChange={e => setFactor(e.target.value)}></Input>
        </ModalBody>
        <ModalFooter>
          <Button className="btn" color="info" onClick={() => setEditModalShow(false)}>Close</Button>
          <Button className="btn" color="danger" onClick={() => editSubmit()}>Apply</Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={delModalShow} size="sm" className="modal-seemore">
        <ModalHeader>Delete</ModalHeader>
        <ModalBody>Confirm ?</ModalBody>
        <ModalFooter>
          <Button className="btn" color="info" onClick={() => setDelModalShow(false)}>No</Button>
          <Button classname="btn" color="danger" onClick={() => delDoc()}>Yes</Button>
        </ModalFooter>
      </Modal>
    </div>
  );

}

export default Member;
