
import React, { useState, useEffect, useContext } from 'react';
import firebaseApp from '../firebase.js';
import { Redirect } from 'react-router-dom'
import { AuthContext } from "components/Auth/Auth.js";
import Insertmenu from "views/insertmenu.jsx";
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { Link } from 'react-router-dom';
import { Line, Pie } from "react-chartjs-2";
// reactstrap components
import { Col, Card, Row } from "react-bootstrap";
import {
  Button, CardHeader, CardBody, CardFooter, CardTitle,
  FormGroup, Form, Input, InputGroup, InputGroupText,
  InputGroupAddon, Table, Modal, ModalHeader, ModalBody,
  ModalFooter
} from "reactstrap";

// core components
import {
  dashboard24HoursPerformanceChart, dashboardEmailStatisticsChart, dashboardNASDAQChart
} from "variables/charts.js";

export const AppContext = React.createContext();

function Dashboard() {

  // ประกาศตัวแปร state
  const [Food, setFood] = useState({})
  const [FoodName, setFoodName] = useState({})
  const [cate, setCate] = useState('')
  const [cate2, setCate2] = useState('')
  const [cate3, setCate3] = useState('')
  const [cate4, setCate4] = useState('')
  const [cate5, setCate5] = useState('')

  const [search, setSearch] = useState('')

  const [idDoc, setIdDoc] = useState('')
  const [seeMoreModalShow, setSeeMoreModalShow] = useState(false)
  const [resultShow, setResultShow] = useState(false)

  const [filterTitle, setFilterTile] = useState('')
  const [filterWriters, setFilterWriters] = useState([])
  const [filterJournal, setFilterJounal] = useState('')
  const [filterYear, setfilterYear] = useState('')
  const [filterQuartile, setFilterQuartile] = useState('')
  const [filterFactor, setFilterFactor] = useState('')

  const [research, setResearch] = useState([])
  const [title, setTtile] = useState('')
  const [writers, setWriters] = useState([])
  const [journal, setJounal] = useState('')
  const [year, setYear] = useState('')
  const [quartile, setQuartile] = useState('')
  const [dropdown, setDropdown] = useState('title')
  const [filter, setFilter] = useState({})

  // ประกาศตัวแปรเพื่ออ้างอิง user collection
  const db = firebaseApp.firestore()
  const Collection = db.collection('Food2')
  const userCollection = db.collection('Food2')

  const researchRef = db.collection('research')

  useEffect(() => {
    // subscription นี้จะเกิด callback กับทุกการเปลี่ยนแปลงของ collection Food
    const unsubscribe = researchRef.onSnapshot(ss => {
      // ตัวแปร local
      const research = []

      ss.forEach(document => {
        // manipulate ตัวแปร local
        research.push(document.data())
      })

      // เปลี่ยนค่าตัวแปร state
      setResearch(research)
      // console.log(research)
    })

    return () => {
      // ยกเลิก subsciption เมื่อ component ถูกถอดจาก dom
      unsubscribe()
    }
  }, [])   //เมื่อค่า cate เปลี่ยนจะทำการอัพเดท useEffect ใหม่ #ไอห่า หาเป็นวันกว่าจะได้ 

  function clearall() {
    document.getElementById("formFind").reset()
    setYear("")
    setQuartile("")
    setResultShow(false)
  }

  const goToSeemore = () => { window.location.href = "/admin/seemore"; }

  function find() {
    const researchAll = research
    let filter = []

    if (search != '') {
      if (dropdown == "title") {
        for (let i = 0; i < researchAll.length; i++) {
          if (researchAll[i].name.toLowerCase().includes(search.toLowerCase())) {
            filter.push(researchAll[i])
          }
        }
      }

      if (dropdown == "researcher") {
        for (let i = 0; i < researchAll.length; i++) {
          let count = 0
          for (let j = 0; j < researchAll[i].writer.length; j++) {
            if (researchAll[i].writer[j].toLowerCase().includes(search.toLowerCase())) { count++ }
          }
          if (count > 0) {
            filter.push(researchAll[i])
          }
        }
      }

      if (dropdown == "journal") {
        for (let i = 0; i < researchAll.length; i++) {
          if (researchAll[i].journal.toLowerCase().includes(search.toLowerCase())) {
            filter.push(researchAll[i])
          }
        }
      }
    }

    if (search == '') { filter = researchAll }

    if (year != '') {
      let yearFilter = []
      for (let i = 0; i < filter.length; i++) {
        if (filter[i].year == year) { yearFilter.push(filter[i]) }
      }
      filter = yearFilter
    }

    if (quartile != '') {
      let quartileFilter = []
      for (let i = 0; i < filter.length; i++) {
        if (filter[i].quartile == quartile) { quartileFilter.push(filter[i]) }
      }
      filter = quartileFilter
    }

    setFilter(filter)
    setResultShow(true)
    // console.log(filter[1].writer)
    // console.log(researchAll.name)
    // console.log(dropdown)
    // console.log(search)
  }

  // const { currentUser } = useContext(AuthContext);
  // if (currentUser) { return <Redirect to="/member/menu" />; }

  function deleteDocument(id) {
    // ประกาศตัวแปรเพื่ออ้างอิงไปยัง document ที่จะทำการลบ
    const documentRef = researchRef.doc(id)
    // ลบ document
    documentRef.delete()

    alert(`document ${id} has been deleted`)
  }

  function seeDocModal(id) {
    setIdDoc(id)
    setSeeMoreModalShow(true)

    setFilterTile(filter[id].name)
    setFilterWriters(filter[id].writer)
    setFilterJounal(filter[id].journal)
    setfilterYear(filter[id].year)
    setFilterQuartile(filter[id].quartile)
    setFilterFactor(filter[id].factor)
  }

  return (
    <div style={{ display: "flex", justifyContent: "center" }} className="content">
      <Col md="12">
        <Row>

          <Col md="3">
            <Card className="card-user">
              <CardBody>
                <h5>Select Filter</h5>
                <Form id="formFind">
                  <FormGroup>
                    <Input onChange={(e) => setSearch(e.target.value)}
                      placeholder="Author, Title, Journal" name="search"></Input>
                  </FormGroup>
                  <FormGroup>
                    <Input onChange={(e) => setDropdown(e.target.value)}
                      name="select" type="select">
                      <option value="">Select</option>
                      <option value="researcher">Author</option>
                      <option value="title">Title</option>
                      <option value="journal">Journal</option>
                    </Input>
                  </FormGroup>
                </Form>
                <Table borderless className="admin-insert">
                  <thead>
                    <tr>
                      <th> Year {year}</th>
                      <th> Quartile {quartile}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* <tr>
											<td><Button class="btn22 default" color="warning" value={year} onClick={e => setYear("")}> clear</Button></td>
											<td><Button class="btn22 default" color="warning" value={quartile} onClick={e => setQuartile("")}> clear</Button></td>
										</tr> */}

                    <tr>
                      <td><Button outline class="btn btn" color="primary" value={year} onClick={e => setYear("2020")}>2020</Button></td>
                      <td><Button outline class="btn btn" color="warning" value={quartile} onClick={e => setQuartile("Q1")}>Q1</Button></td>
                    </tr>
                    <tr>
                      <td><Button outline class="btn btn" color="primary" value={year} onClick={e => setYear("2021")}>2021</Button></td>
                      <td><Button outline class="btn btn" color="warning" value={quartile} onClick={e => setQuartile("Q2")}>Q2</Button></td>
                    </tr>
                    <tr>
                      <td><Button outline class="btn btn" color="primary" value={year} onClick={e => setYear("2022")}>2022</Button></td>
                      <td><Button outline class="btn btn" color="warning" value={quartile} onClick={e => setQuartile("Q3")}>Q3</Button></td>
                    </tr>
                    <tr>
                      <td></td>
                      <td><Button outline class="btn btn" color="warning" value={quartile} onClick={e => setQuartile("Q4")}>Q4</Button></td>
                    </tr>
                  </tbody>
                </Table>
                <div className="button-container">
                  <Button onClick={() => clearall()} class="btn btn" color="info">
                    Clear All
                  </Button>
                  <Button onClick={() => find()} class="btn btn" color="danger">
                    Search
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>

          {(resultShow) ? (<Col md="9">
            <Card className="card-user">
              <CardBody>
                <CardTitle className="content">
                  <h3>Research</h3>
                </CardTitle>
                <Col md="12">
                  <Row className="ex1">
                    {Object.keys(filter).map((id) => {
                      return <Col md="12">
                        <div key={id}>
                          <Card className="card-research">
                            {Object.keys(filter[id].writer).map((id2) => {
                              return <p className='ml-2'>Author : {filter[id].writer[id2]}</p>
                            })}
                            <p className='ml-2'>Title : {filter[id].name}</p>
                            <p className='ml-2'>Journal : {filter[id].journal}</p>
                            {/* <p className='ml-2'>Year : {filter[id].year}</p>
														<p className='ml-2'>Quartile : {filter[id].quartile}</p>
														<p className='ml-2'>Impact Factor : {filter[id].factor}</p> */}
                            <div className="others">
                              <Link className="others" onClick={() => seeDocModal(id)}>See More</Link>
                            </div>
                          </Card>
                        </div>
                      </Col>
                    })}
                  </Row>
                </Col>
              </CardBody>
            </Card>
          </Col>) : (<Col md='9'>
            <Card>
              <CardBody>
                <CardTitle className="content"><h3>Research</h3></CardTitle>
                <Col md="12"><Row className="ex1 border rounded border-secondary">
                  <h6 className='m-auto'>the result will be displayed here</h6>
                </Row></Col>
              </CardBody>
            </Card>
          </Col>)}

        </Row>
      </Col>

      <Modal isOpen={seeMoreModalShow} size="md" className="modal-seemore">
        <ModalHeader>See More</ModalHeader>
        <ModalBody>
          <p>Author : </p>
          {Object.keys(filterWriters).map((id2) => {
            return (
              <p>{filterWriters[id2]}</p>
            );
          })}
          <p>Title : {filterTitle}</p>
          <p>Journal : {filterJournal}</p>
          <p>Year : {filterYear}</p>
          <p>Quartile : {filterQuartile}</p>
          <p>Impact factor : {filterFactor}</p>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => setSeeMoreModalShow(false)} class="btn btn" color="danger">
            close
          </Button>
        </ModalFooter>
      </Modal>
    </div >
  );
}

export default Dashboard;
