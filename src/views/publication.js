
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
  ModalFooter, Pagination, PaginationItem, PaginationLink,
} from "reactstrap";

// core components
import {
  dashboard24HoursPerformanceChart, dashboardEmailStatisticsChart, dashboardNASDAQChart
} from "variables/charts.js";

export const AppContext = React.createContext();

function Dashboard() {

  // ประกาศตัวแปร state
  // const [Food, setFood] = useState({})
  // const [FoodName, setFoodName] = useState({})
  // const [cate, setCate] = useState('')
  // const [cate2, setCate2] = useState('')
  // const [cate3, setCate3] = useState('')
  // const [cate4, setCate4] = useState('')
  // const [cate5, setCate5] = useState('')

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(4)
  const [indexLast, setIndexLast] = useState(0)
  const [indexFirst, setInedexFirst] = useState(0)
  const [pageNumbers, setPageNumbers] = useState([])
  const [searchResult, setSearchResult] = useState([])

  const [search, setSearch] = useState('')

  const [idDoc, setIdDoc] = useState('')
  const [seeMoreModalShow, setSeeMoreModalShow] = useState(false)
  const [resultShow, setResultShow] = useState(false)

  const [filterTitle, setFilterTile] = useState('')
  const [filterWriters, setFilterWriters] = useState([])
  const [filterJournal, setFilterJounal] = useState('')
  const [filterYear, setfilterYear] = useState('')
  const [filterPublish, setfilterPublish] = useState('')
  const [filterQuartile, setFilterQuartile] = useState('')
  const [filterFactor, setFilterFactor] = useState('')

  const [research, setResearch] = useState([])
  const [title, setTtile] = useState('')
  const [writers, setWriters] = useState([])
  const [journal, setJounal] = useState('')
  const [year, setYear] = useState('')
  const [quartile, setQuartile] = useState('')
  const [dropdown, setDropdown] = useState('')

  const [filter, setFilter] = useState({})
  const [file, setFile] = useState("")
  const [fileName, setFileName] = useState("")

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

    const idxLast = currentPage * itemsPerPage
    const idxFirst = idxLast - itemsPerPage
    let pageNum = []

    if (search != '') {

      if (dropdown == "national") {
        for (let i = 0; i < researchAll.length; i++) {
          if (researchAll[i].name.toLowerCase().includes(search.toLowerCase())) {
            if (research[i].publish == 'national') {
              filter.push(researchAll[i])
            }
          }
        }
      }

      if (dropdown == "international") {
        for (let i = 0; i < researchAll.length; i++) {
          if (researchAll[i].name.toLowerCase().includes(search.toLowerCase())) {
            if (research[i].publish == 'international') {
              filter.push(researchAll[i])
            }
          }
        }
      }

      // if (dropdown == "researcher") {
      //   for (let i = 0; i < researchAll.length; i++) {
      //     let count = 0
      //     for (let j = 0; j < researchAll[i].writer.length; j++) {
      //       if (researchAll[i].writer[j].toLowerCase().includes(search.toLowerCase())) { count++ }
      //     }
      //     if (count > 0) { filter.push(researchAll[i]) }
      //   }
      // }

      // if (dropdown == "journal") {
      //   for (let i = 0; i < researchAll.length; i++) {
      //     if (researchAll[i].journal.toLowerCase().includes(search.toLowerCase())) {
      //       filter.push(researchAll[i])
      //     }
      //   }
      // }

    }

    if (search == '') {

      if (dropdown == "national") {
        for (let i = 0; i < researchAll.length; i++) {
          if (research[i].publish == 'national') {
            filter.push(researchAll[i])
          }
        }
      }

      if (dropdown == "international") {
        for (let i = 0; i < researchAll.length; i++) {
          if (research[i].publish == 'international') {
            filter.push(researchAll[i])
          }
        }
      }

      if (dropdown == "") { filter = researchAll }

    }

    // if (year != '') {
    //   let yearFilter = []
    //   for (let i = 0; i < filter.length; i++) {
    //     if (filter[i].year == year) { yearFilter.push(filter[i]) }
    //   }
    //   filter = yearFilter
    // }

    // if (quartile != '') {
    //   let quartileFilter = []
    //   for (let i = 0; i < filter.length; i++) {
    //     if (filter[i].quartile == quartile) { quartileFilter.push(filter[i]) }
    //   }
    //   filter = quartileFilter
    // }

    for (let i = 1; i <= Math.ceil(filter.length / itemsPerPage); i++) { pageNum.push(i) }

    setFilter(filter)
    setSearchResult(filter)
    setResultShow(true)
    setFilter(filter.slice(idxFirst, idxLast))
    setPageNumbers(pageNum)
    // console.log(filter.length)
    // console.log(researchAll.name)
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
    setfilterPublish(filter[id].publish)
    setFilterQuartile(filter[id].quartile)
    setFilterFactor(filter[id].factor)
    setFile(filter[id].file)
    setFileName(filter[id].fileName)
  }

  const downloadPDF = (file, fileName) => {
    const linkSource = file;
    const downloadLink = document.createElement("a");
    // const fileName = fileName;

    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }

  const goToPage = (number) => {

    const idxLast = number * itemsPerPage
    const idxFirst = idxLast - itemsPerPage

    setFilter(searchResult.slice(idxFirst, idxLast))
  }

  return (
    <div style={{ display: "flex", justifyContent: "center" }} className="content">
      <Col md="12">
        <Row style={{ display: "flex", justifyContent: "center" }}>
          <Col md="6">
            <Card className="card-search">
              <Form id="formFind">
                <Row>
                  <Col xs="2" md="2" lg="1">
                    <div className="icon-search">
                      <i class="nc-icon nc-zoom-split"></i>
                    </div>
                  </Col>
                  <Col xs="10" md="10" lg="11">
                    <div className="box-input-search">
                      <Input onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search..." name="search" type="search" className="input-search"></Input>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Card>
          </Col>
          <Col md="2" className='mt-2 mx-0 px-0'>
            <Form id="formFind">
              <FormGroup>
                <Input onChange={(e) => setDropdown(e.target.value)}
                  name="select" type="select" className="input-journal text-center pt-2">
                  <option value="">- Publish -</option>
                  <option value="international">International</option>
                  <option value="national">National</option>
                </Input>
              </FormGroup>
            </Form>
          </Col>
          <Col md='2' className="button-container-search my-0">
            <Button onClick={() => find()} className="btn-round button-search" color="danger">
              Search
            </Button>
          </Col>
        </Row>
        <br></br>
        <Col md="12">
          <p>{/*... results retrieved for search term "math"*/}</p>
        </Col>
        <Col md="12" style={{ display: "flex", justifyContent: "center" }}>

          <Pagination aria-label="Page navigation example" size="" className="page-number">
            {pageNumbers.map(number => (
              <PaginationItem>
                <PaginationLink onClick={() => goToPage(number)}>{number}</PaginationLink>
              </PaginationItem>
            ))}
          </Pagination>

        </Col>
        {/* <Col md="6">
          <Card className="card-search2">
            <label>Select Filter</label>
            <Row>
              <Col md="3">
                <Form id="formFind">
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
              </Col>
              <Col md="3">
                <Form id="formFind">
                  <FormGroup>
                    <Input onChange={(e) => setDropdown(e.target.value)}
                      name="select" type="select">
                      <option value="year">Year</option>
                      <option value={year} onClick={e => setYear("2020")}>2020</option>
                      <option value={year} onClick={e => setYear("2021")}>2021</option>
                      <option value={year} onClick={e => setYear("2022")}>2022</option>
                    </Input>
                  </FormGroup>
                </Form>
              </Col>
              <Col md="3">
                <Form id="formFind">
                  <FormGroup>
                    <Input onChange={(e) => setDropdown(e.target.value)}
                      name="select" type="select">
                      <option value="quartile">Quartile</option>
                      <option value={quartile} onClick={e => setQuartile("Q1")}>Q1</option>
                      <option value={quartile} onClick={e => setQuartile("Q2")}>Q2</option>
                      <option value={quartile} onClick={e => setQuartile("Q3")}>Q3</option>
                      <option value={quartile} onClick={e => setQuartile("Q4")}>Q4</option>
                    </Input>
                  </FormGroup>
                </Form>
              </Col>
            </Row>
            <div className="button-container-search">
              <Button onClick={() => clearall()} className="btn-round button-clear" color="info">
                Clear All
              </Button>
              <Button onClick={() => find()} className="btn-round button-search" color="danger">
                Search
              </Button>
            </div>
          </Card>
        </Col> */}

        {/* <Col md="3">
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
        </Col> */}

        {
          (resultShow) ? (<Col md="12">
            <Card>
              <CardBody>
                <CardTitle className="content">
                </CardTitle>
                <Col md="12">
                  <Row className="ex1">
                    {Object.keys(filter).map((id) => {
                      return <Col md="12">
                        <div key={id}>
                          <div>
                            <Link className="others" onClick={() => seeDocModal(id)}>
                              {filter[id].name}&nbsp;
                            </Link>
                            <span>({filter[id].year})</span>
                          </div>
                          {Object.keys(filter[id].writer).map((id2) => {
                            return <span>{filter[id].writer[id2]},</span>
                          })}
                        </div>
                        <br></br>
                        <hr></hr>
                      </Col>
                    })}
                  </Row>
                </Col>
              </CardBody>
            </Card>
          </Col>) : (<Col md='12'>
            <Card>
              <CardBody>
                <CardTitle className="content"></CardTitle>
                <Col md="12">
                  <Row className="ex1 border border-dark">
                    <h6 className='m-auto'>The result will be displayed here</h6>
                  </Row>
                </Col>
              </CardBody>
            </Card>
          </Col>)
        }
      </Col>

      <Modal isOpen={seeMoreModalShow} size="md" className="modal-seemore">
        <ModalHeader>Publication Detail</ModalHeader>
        <ModalBody>
          <h6>{filterTitle}</h6>
          <br />
          <h6>Authors</h6>
          {Object.keys(filterWriters).map((id2) => {
            return (
              <li>{filterWriters[id2]}</li>
            );
          })}
          <br></br>

          {/* <div>Author list: :
            {Object.keys(filterWriters).map((id2) => {
              return <span>{filterWriters[id2]},</span>
            })}
          </div> */}
          <div>Journal : {filterJournal}</div>
          <div>Year : {filterYear}</div>
          <div>Publish : {filterPublish}</div>
          <div>Quartile : {filterQuartile}</div>
          <div>Impact factor : {filterFactor}</div>
          <br></br>
          <h6>Documents</h6>
          <embed src={file} /><br></br>
          <Button onClick={() => downloadPDF(file, fileName)} color="info" className='btn btn-primary btn-sm'>download</Button>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => setSeeMoreModalShow(false)} class="btn" size="sm" color="danger">
            close
          </Button>
        </ModalFooter>
      </Modal>
    </div >
  );
}

export default Dashboard;