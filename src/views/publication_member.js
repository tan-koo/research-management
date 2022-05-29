
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
import { InputGroup } from 'react-bootstrap';

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
  const [Research, setResearch] = useState({})

  const [userMe, setUserMe] = useState({})
  const [userUid, setUserUid] = useState("")

  const [name, setName] = useState('')
  const [writer, setWriter] = useState([])
  const [journal, setJournal] = useState('')
  const [year, setYear] = useState('')
  const [publish, setPublish] = useState('')
  const [quartile, setQuartile] = useState('')
  const [factor, setFactor] = useState('')

  const [seeMoreModalShow, setSeeMoreModalShow] = useState(false)
  const [editModalShow, setEditModalShow] = useState(false)
  const [delModalShow, setDelModalShow] = useState(false)

  const [idDoc, setIdDoc] = useState('')

  const history = useHistory()

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

        ss.forEach(document => {
          // manipulate ตัวแปร local
          User[document.id] = document.data()
          setUserUid(User[document.id].Uid)
        })

        // เปลี่ยนค่าตัวแปร state
        setUserMe(User)
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
      const researchRef = db.collection('research')

      // subscription นี้จะเกิด callback กับทุกการเปลี่ยนแปลงของ collection Food
      const unsubscribe = researchRef.onSnapshot(ss => {
        // ตัวแปร local
        const Research = {}

        ss.forEach(document => {
          // manipulate ตัวแปร local
          Research[document.id] = document.data()
          // console.log(userUid)
          // console.log(document.data().factor)
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
    setIdDoc(id)
    setSeeMoreModalShow(true)

    setName(Research[id].name)
    setWriter(Research[id].writer)
    setJournal(Research[id].journal)
    setYear(Research[id].year)
    setPublish(Research[id].publish)
    setQuartile(Research[id].quartile)
    setFactor(Research[id].factor)
  }

  function editDocModal(id) {
    setIdDoc(id)
    setEditModalShow(true)

    setName(Research[id].name)
    setWriter(Research[id].writer)
    setJournal(Research[id].journal)
    setYear(Research[id].year)
    setPublish(Research[id].publish)
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
              <Button classname="btn btn-" color="danger" onClick={() => goToInsert()}>
                <i class="fa fa-solid fa-plus"></i>
              </Button>
            </div>
            <Table hover responsive className="table-admin">
              <thead>
                <tr>
                  <th width="20px">#</th>
                  <th width="50px">Author</th>
                  <th width="30px">Title</th>
                  <th width="30px">Actions</th>
                </tr>
              </thead>
              {Object.keys(Research).map((id) => {
                return (
                  <tbody>
                    {(Research[id].userUid == userUid) ? (<tr>
                      <th scope="row">{rowNumber()}</th>
                      <td>
                        {Object.keys(Research[id].writer).map((id2) => {
                          return (<span>{Research[id].writer[id2]},</span>)
                        })}
                      </td>
                      <td>
                        <p>{Research[id].name}</p>
                      </td>
                      <td>
                        <a title class="btn btn-info btn-link btn-xs"
                          onClick={() => seeDocModal(id)}>
                          <i class="fa fa-solid fa-eye"></i>
                        </a>
                        <a title class="btn btn-success btn-link btn-xs"
                          onClick={() => editDocModal(id)}>
                          <i class="fa fa-solid fa-pen"></i>
                        </a>
                        <a title class="btn btn-danger btn-link btn-xs"
                          onClick={() => delDocModal(id)}>
                          <i class="fa fa-solid fa-trash"></i>
                        </a>
                      </td>
                    </tr>) : null}
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

      <Modal isOpen={seeMoreModalShow} size="md" className="modal-seemore">
        <ModalHeader>Detail</ModalHeader>
        <ModalBody>
          <h6>{name}</h6>
          <br></br>
          <h6>Author list: :
            {Object.keys(writer).map((id2) => {
              return <span>{writer[id2]},</span>
            })}
          </h6>
          <br></br>
          <p>Journal : {journal}</p>
          <p>Year : {year}</p>
          <p>Publish : {publish}</p>
          <p>Quartile : {quartile}</p>
          <p>Impact factor : {factor}</p>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => setSeeMoreModalShow(false)} class="btn" color="danger">close</Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={editModalShow} size="lg" className="modal-seemore">
        <ModalHeader>Edit</ModalHeader>
        <ModalBody>
          <FormGroup>
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
            <br></br>
            <p>Journal</p>
            <Input type="textarea" onChange={e => setJournal(e.target.value)}
              defaultValue={journal}></Input>
            <br></br>
            <Row>
              <Col md='6'>
                <p>Year</p>
                <Input onChange={e => setYear(e.target.value)} defaultValue={year}></Input>
              </Col>
              <Col md='6'>
                <p>Quartile</p>
                <Input bsSize="" type="select" defaultValue={publish} onChange={e => setPublish(e.target.value)}>
                  <option value="national">National</option>
                  <option value="international">International</option>

                </Input>
              </Col>

            </Row>
            <br></br>
            <Row>
              <Col md='6'>
                <p>Quartile</p>
                <Input bsSize="" type="select" defaultValue={quartile} onChange={e => setQuartile(e.target.value)}>
                  <option value="Q1">Q1</option>
                  <option value="Q2">Q2</option>
                  <option value="Q3">Q3</option>
                  <option value="Q4">Q4</option>
                  <option value="others">Others</option>
                </Input>
              </Col>
              <Col md='6'>
                <p>Impact factor</p>
                <Input defaultValue={factor} onChange={e => setFactor(e.target.value)}></Input>
              </Col>
            </Row>
          </FormGroup>
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
