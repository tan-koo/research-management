
import React, { useState, useEffect, useContext } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import { AuthContext } from "components/Auth/Auth.js";
import { Redirect } from "react-router-dom";
import Display from "components/Display.jsx";
import { AppContext } from "views/admin_menu.jsx";
import {
  Card, CardHeader, CardBody, CardFooter, CardTitle,
  Row, FormGroup, Form, Input, Col,
  DropdownMenu, DropdownItem, Button, Select
} from "reactstrap";

// เรียกใช้ module
import firebaseApp from "../firebase.js";
import { SplitButton } from "react-bootstrap";

function Insert() {
  const [Uimage, setUimage] = useState("");
  const [loading, setLoading] = useState(false);

  const uploadUimage = async (e) => {
    const files = e.target.files;
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "Food_images");
    setLoading(true);
    const res = await fetch(
      "	https://api.cloudinary.com/v1_1/daxwfdlwj/image/upload",
      {
        method: "POST",
        body: data,
      }
    );
    const file = await res.json();
    //เปลี่ยน setIimage เป็น setImage เพื่อเก็บ url โดยตรง
    setimage(file.secure_url);
    console.log(file.secure_url);
    setLoading(false);
  };

  // ประกาศตัวแปร state และ method สำหรับเปลี่ยนค่าตัวแปร
  const [image, setimage] = useState("");
  const [restaurant, setrestaurant] = useState("");
  const [RestaurantName, setRestaurantName] = useState({});

  const [userMe, setUserMe] = useState({});
  const [userUid, setUserUid] = useState("");

  const [all, setall] = useState("");
  const [writer, setwriter] = useState([]);
  const [name, setname] = useState("");
  const [journal, setjournal] = useState("");
  const [year, setyear] = useState("");
  const [quartile, setquartile] = useState("");
  const [publish, setpublish] = useState("");
  const [factor, setfactor] = useState("");
  const [file, setFile] = useState("")
  const [fileName, setFileName] = useState("")

  const [allWriter, setallWriter] = useState("");

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    //ใช้ firebaseApp.auth().onAuthStateChanged เพื่อใช้ firebaseApp.auth().currentUser โดยไม่ติด error เมื่อทำการ signout
    firebaseApp.auth().onAuthStateChanged((user) => {
      const db = firebaseApp.firestore();
      const userRef = db
        .collection("User")
        .where("Uid", "==", firebaseApp.auth().currentUser.uid);

      // subscription นี้จะเกิด callback กับทุกการเปลี่ยนแปลงของ collection Food
      const unsubscribe = userRef.onSnapshot((ss) => {
        // ตัวแปร local
        const User = {};

        ss.forEach((document) => {
          // manipulate ตัวแปร local
          User[document.id] = document.data();
          setUserUid(User[document.id].Uid);
        });

        // เปลี่ยนค่าตัวแปร state
        setUserMe(User);
      });

      return () => {
        // ยกเลิก subsciption เมื่อ component ถูกถอดจาก dom
        unsubscribe();
      };
    });
  }, []);

  useEffect(() => {
    //ใช้ firebaseApp.auth().onAuthStateChanged เพื่อใช้ firebaseApp.auth().currentUser โดยไม่ติด error เมื่อทำการ signout
    firebaseApp.auth().onAuthStateChanged((user) => {
      const db = firebaseApp.firestore();
      const RestaurantCollection = db.collection("Restaurant");

      // subscription นี้จะเกิด callback กับทุกการเปลี่ยนแปลงของ collection Restaurant
      const unsubscribe = RestaurantCollection.onSnapshot((ss) => {
        // ตัวแปร local
        const Restaurant = {};
        const RestaurantName = [];

        ss.forEach((document) => {
          // manipulate ตัวแปร local
          Restaurant[document.id] = document.data();
          RestaurantName.push(Restaurant[document.id].name);
        });

        // เปลี่ยนค่าตัวแปร state
        setRestaurantName(RestaurantName);
      });

      return () => {
        // ยกเลิก subsciption เมื่อ component ถูกถอดจาก dom
        unsubscribe();
      };
    });
  }, []);

  if (!currentUser) { return <Redirect to="/general/login" />; }

  // ประกาศตัวแปรเพื่ออ้างอิง user collection
  const db = firebaseApp.firestore();
  const researchCollection = db.collection("research");

  async function insertDocument() {
    // if (userMeRole.localeCompare("admin") !== 0) { alert(`Sorry, you are not admin.`); }
    // else {
    if (name !== "" && journal !== "" && year !== "" && factor !== "") {
      // insert และคืน document reference
      const documentRef = await researchCollection.add({
        writer,
        name,
        journal,
        year,
        publish,
        quartile,
        factor,
        file,
        fileName,
        userUid
      });

      alert(`Successful`);

      window.location.reload(false);

      window.location.href = "/member/insert";
    } else { alert(`Please fill in the blanks.`); }
    // }
  }

  const Split = () => {
    var subData = all.split(",");
    var writers = [];
    var text = "";
    // console.log(subData[1].length)

    for (let i = 0; i < subData.length; i++) {
      if (subData[i].split(" ").length - 1 <= 2) { writers.push(subData[i]); }
      if (subData[i].split(" ").length - 1 > 2) { break; }
    }
    // console.log(writer.length)

    for (let i = 0; i < writers.length; i++) {
      if (i == writers.length - 1) { text = text + writers[i]; }
      if (i < writers.length - 1) { text = text + writers[i] + ", "; }
    }

    setwriter(writers);
    setallWriter(text);
    setname(subData[writers.length]);
    setjournal(subData[writers.length + 1]);
    setyear(subData[writers.length + 2]);

    // console.log(writer)      // ทดสอบ print ข้อมูลใน writer
  };

  const onUploadFileChange = ({ target }) => {
    if (target.files < 1 || !target.validity.valid) { return (null) }

    fileToBase64(target.files[0], (err, result) => {
      if (result) {
        // console.log("hello")
        // console.log(result)
        // console.log(target.files[0].name)
        setFile(result)
        setFileName(target.files[0].name)
      }
    })
  }

  const fileToBase64 = (file, cb) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = function () { cb(null, reader.result) }
    reader.onerror = function (error) { cb(error, null) }
  }

  // const splitkey = [];
  // let curName = '';
  // name.split('').forEach((letter) => {
  //   curName += letter;
  //   splitkey.push(curName);
  // })
  // splitkey.push("@")
  // splitkey.push(cate1)
  // splitkey.push(cate2)
  // splitkey.push(cate3)
  // splitkey.push(cate4)
  // const Cate = [];
  // Cate.push(cate1)
  // Cate.push(cate2)
  // Cate.push(cate3)
  // Cate.push(cate4)

  // const cate = Cate.filter(Cate => Cate !== "")
  // const searchkey = splitkey.filter(splitkey => splitkey !== "")

  // var BLsearchkey = {};
  //     searchkey.forEach(function (v) {
  //       BLsearchkey[v] = true;
  //   });

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }} className="content">
      <Col md="8">
        <Card className="card-user">
          <CardBody>
            <Form>
              <CardTitle style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                className="content">
                <h3></h3>
              </CardTitle>
              <Row>
                <Col md="12">
                  <FormGroup>
                    <label>Step 1 Enter all the information.</label>
                    <p>
                      Where Format is as follows: Name1 Surname1, Name2 Surname2, Title, Journal, Year
                    </p>
                    <Input type="textarea" onChange={(e) => setall(e.target.value)}></Input>
                    <button type="button" right class="btn btn-outline-danger" onClick={() => Split()}>
                      Sorted by field
                    </button>
                  </FormGroup>
                </Col>
              </Row>

              <hr></hr>

              <Row>
                <Col md="12">
                  <FormGroup>
                    <label>Step 2 Each field</label>
                    <p>Author</p>
                    {Object.keys(writer).map((id) => {
                      return (
                        <Col md="12">
                          <Row>
                            <Input type="text" defaultValue={writer[id]}></Input>
                          </Row>
                          <br></br>
                        </Col>
                      );
                    })}

                    <p>Title</p>
                    <Input type="textarea" onChange={(e) => setname(e.target.value)} defaultValue={name}></Input>

                    <br></br>

                    <p>Journal</p>
                    <Input type="textarea" onChange={(e) => setjournal(e.target.value)} defaultValue={journal}></Input>

                    <br></br>

                    <Row>
                      <Col md="6">
                        <p>Year</p>
                        <Input onChange={(e) => setyear(e.target.value)} defaultValue={year}></Input>
                      </Col>
                      <Col md="6">
                        <p>Publish</p>
                        <Input bsSize="" type="select" onChange={(e) => setpublish(e.target.value)}>
                          <option value="None">-- Select --</option>
                          <option value="national">National</option>
                          <option value="international">International</option>
                        </Input>
                      </Col>
                    </Row>
                    <br></br>
                    <Row>
                      <Col md='6'>
                        <p>Quartile</p>
                        <Input bsSize="" type="select" onChange={(e) => setquartile(e.target.value)}>
                          <option value="None">-- Select --</option>
                          <option value="Q1">Q1</option>
                          <option value="Q2">Q2</option>
                          <option value="Q3">Q3</option>
                          <option value="Q4">Q4</option>
                          <option value="others">Others</option>
                        </Input>
                      </Col>
                      <Col md='6'>
                        <p>Impact Factor <a href="https://www.scimagojr.com/index.php">Check it</a></p>
                        <Input onChange={(e) => setfactor(e.target.value)}></Input>
                      </Col>
                    </Row>

                    <br></br>

                    <p>File</p>
                    <Input id="exampleFile" multiple name="file" type="file"
                      onChange={onUploadFileChange} />
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <div className="update ml-auto mr-auto">
                  <Button classname="btn btn-" onClick={insertDocument} color="danger">
                    Save
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

export default Insert;
