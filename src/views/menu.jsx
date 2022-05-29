import React, { useState, useEffect, useContext } from "react";
import firebaseApp from "../firebase.js";
import { Redirect } from "react-router-dom";
import { AuthContext } from "components/Auth/Auth.js";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import { Link } from "react-router-dom";
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

function Menu() {
  // ประกาศตัวแปร state
  const [Food, setFood] = useState({});
  const [FoodName, setFoodName] = useState({});
  const [cate, setCate] = useState("");
  const [cate2, setCate2] = useState("");
  const [cate3, setCate3] = useState("");
  const [cate4, setCate4] = useState("");
  const [cate5, setCate5] = useState("");
  const [search, setSearch] = useState("");

  // ประกาศตัวแปรเพื่ออ้างอิง user collection
  const db = firebaseApp.firestore();
  const Collection = db.collection("Food2");
  let s = "BLsearchkey." + search;
  let c1 = "BLsearchkey." + cate;
  let c2 = "BLsearchkey." + cate2;
  let c3 = "BLsearchkey." + cate3;
  let c4 = "BLsearchkey." + cate4;
  let c5 = "BLsearchkey." + cate5;
  let catecheck = "BLsearchkey.@";
  //แก้บัค
  if (search == "" || search == null) {
    s = "BLsearchkey.@";
  }
  if (cate == "") {
    c1 = "BLsearchkey.@";
  }
  if (cate2 == "") {
    c2 = "BLsearchkey.@";
  }
  if (cate3 == "") {
    c3 = "BLsearchkey.@";
  }
  if (cate4 == "") {
    c4 = "BLsearchkey.@";
  }
  if (cate5 == "") {
    c5 = "BLsearchkey.@";
  }
  if (
    s == "BLsearchkey.@" &&
    c1 == "BLsearchkey.@" &&
    c2 == "BLsearchkey.@" &&
    c3 == "BLsearchkey.@" &&
    c4 == "BLsearchkey.@" &&
    c5 == "BLsearchkey.@"
  ) {
    catecheck = "BLsearchkey.Close";
  } else {
    catecheck = "BLsearchkey.@";
  }
  const CateCollection = Collection.where(s, "==", true)
    .where(c1, "==", true)
    .where(c2, "==", true)
    .where(c3, "==", true)
    .where(c4, "==", true)
    .where(c5, "==", true)
    .where(catecheck, "==", true);
  //const SearchCollection = CateCollection.orderBy("name").startAt(search).endAt(search + "\uf8ff")

  useEffect(() => {
    // subscription นี้จะเกิด callback กับทุกการเปลี่ยนแปลงของ collection Food
    const unsubscribe = CateCollection.onSnapshot((ss) => {
      // ตัวแปร local
      const Food = {};

      ss.forEach((document) => {
        // manipulate ตัวแปร local
        Food[document.id] = document.data();
      });

      // เปลี่ยนค่าตัวแปร state
      setFood(Food);
    });

    return () => {
      // ยกเลิก subsciption เมื่อ component ถูกถอดจาก dom
      unsubscribe();
    };
  }, [s, c1, c2, c3, c4, c5]); //เมื่อค่า cate เปลี่ยนจะทำการอัพเดท useEffect ใหม่ #ไอห่า หาเป็นวันกว่าจะได้

  useEffect(() => {
    //ใช้ firebaseApp.auth().onAuthStateChanged เพื่อใช้ firebaseApp.auth().currentUser โดยไม่ติด error เมื่อทำการ signout
    firebaseApp.auth().onAuthStateChanged((user) => {
      const db = firebaseApp.firestore();
      const FoodCollection = db.collection("Food2");

      // subscription นี้จะเกิด callback กับทุกการเปลี่ยนแปลงของ collection Food
      const unsubscribe = FoodCollection.onSnapshot((ss) => {
        // ตัวแปร local
        const Food = {};
        const FoodName = [];

        ss.forEach((document) => {
          // manipulate ตัวแปร local
          Food[document.id] = document.data();
          FoodName.push(Food[document.id].name);
        });

        // เปลี่ยนค่าตัวแปร state
        setFoodName(FoodName);
        console.log(FoodName);
      });

      return () => {
        // ยกเลิก subsciption เมื่อ component ถูกถอดจาก dom
        unsubscribe();
      };
    });
  }, [s, c1, c2, c3, c4, c5]);

  function clearall() {
    setSearch("");
    setCate("");
    setCate2("");
    setCate3("");
    setCate4("");
    setCate5("");
  }
  const { currentUser } = useContext(AuthContext);

  if (currentUser) {
    return <Redirect to="/member/menu" />;
  }
  return (
    <>
      <div className="content">
        <Row>
          <Col md="6">
            <form>
              <InputGroup>
                <Autocomplete
                  id="ค้นหาเมนูของคุณ"
                  options={FoodName}
                  onInputChange={(event, newInputValue) => {
                    setSearch(newInputValue);
                  }}
                  style={{ width: 500 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="ค้นหาเมนูของคุณ"
                      margin="normal"
                    />
                  )}
                />
              </InputGroup>
            </form>
          </Col>
        </Row>

        <Row>
          <Col md="6">
            <Card className="card-user">
              <CardHeader>
                <CardTitle tag="h5">
                  เลือกเมนูอาหารตามหมวดหมู่{" "}
                  <button class="btn22 default pull-right" onClick={clearall}>
                    {" "}
                    ล้างหมวดหมู่ที่เลือกทั้งหมด
                  </button>
                </CardTitle>
              </CardHeader>
              <CardBody>
                <table class="table table-borderless">
                  <thead class="thead-dark">
                    <tr>
                      <th scope="col">
                        {" "}
                        <img
                          alt="..."
                          src="https://res.cloudinary.com/daxwfdlwj/image/upload/v1620029352/Food/meat_cu5jle.png"
                          className="photo"
                        />{" "}
                        วัตถุดิบ {cate}
                      </th>
                      <th scope="col">
                        <img
                          alt="..."
                          src="https://res.cloudinary.com/daxwfdlwj/image/upload/v1620030561/Food/taste_vmf85w.png"
                          className="photo"
                        />{" "}
                        รสชาติ {cate2}
                      </th>
                      <th scope="col">
                        <img
                          alt="..."
                          src="https://res.cloudinary.com/daxwfdlwj/image/upload/v1620030614/Food/boiling_e9dr1o.png"
                          className="photo"
                        />{" "}
                        วิธีการ {cate3}
                      </th>

                      <th scope="col">
                        <img
                          alt="..."
                          src="https://res.cloudinary.com/daxwfdlwj/image/upload/v1620030640/Food/flag_zltm9h.png"
                          className="photo"
                        />{" "}
                        สัญชาติ {cate5}
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>
                        <button
                          class="btn22 default"
                          value={cate}
                          onClick={(e) => setCate("")}
                        >
                          {" "}
                          clear
                        </button>
                      </td>
                      <td>
                        <button
                          class="btn22 default"
                          value={cate2}
                          onClick={(e) => setCate2("")}
                        >
                          {" "}
                          clear
                        </button>
                      </td>
                      <td>
                        <button
                          class="btn22 default"
                          value={cate3}
                          onClick={(e) => setCate3("")}
                        >
                          {" "}
                          clear{" "}
                        </button>
                      </td>
                      <td>
                        <button
                          class="btn22 default"
                          value={cate5}
                          onClick={(e) => setCate5("")}
                        >
                          {" "}
                          clear
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <button
                          class="btn22 default"
                          value={cate}
                          onClick={(e) => setCate("หมู")}
                        >
                          หมู{" "}
                        </button>
                      </td>
                      <td>
                        <button
                          class="btn22 default"
                          value={cate2}
                          onClick={(e) => setCate2("เปรี้ยว")}
                        >
                          เปรี้ยว{" "}
                        </button>
                      </td>
                      <td>
                        <button
                          class="btn22 default"
                          value={cate3}
                          onClick={(e) => setCate3("ต้ม")}
                        >
                          {" "}
                          ต้ม{" "}
                        </button>
                      </td>
                      <td>
                        <button
                          class="btn22 default"
                          value={cate5}
                          onClick={(e) => setCate5("ไทย-กลาง")}
                        >
                          {" "}
                          ไทย-กลาง
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <button
                          class="btn22 default"
                          value={cate}
                          onClick={(e) => setCate("ไก่")}
                        >
                          ไก่
                        </button>
                      </td>
                      <td>
                        <button
                          class="btn22 default"
                          value={cate2}
                          onClick={(e) => setCate2("หวาน")}
                        >
                          หวาน
                        </button>
                      </td>
                      <td>
                        <button
                          class="btn22 default"
                          value={cate3}
                          onClick={(e) => setCate3("ผัด")}
                        >
                          ผัด
                        </button>
                      </td>
                      <td>
                        <button
                          class="btn22 default"
                          value={cate5}
                          onClick={(e) => setCate5("ไทย-เหนือ")}
                        >
                          ไทย-เหนือ
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <button
                          class="btn22 default"
                          value={cate}
                          onClick={(e) => setCate("เนื้อวัว")}
                        >
                          เนื้อวัว{" "}
                        </button>
                      </td>
                      <td>
                        <button
                          class="btn22 default"
                          value={cate2}
                          onClick={(e) => setCate2("เค็ม")}
                        >
                          เค็ม
                        </button>
                      </td>
                      <td>
                        <button
                          class="btn22 default"
                          value={cate3}
                          onClick={(e) => setCate3("ตุ๋น")}
                        >
                          ตุ๋น
                        </button>
                      </td>

                      <td>
                        <button
                          class="btn22 default"
                          value={cate4}
                          onClick={(e) => setCate5("ไทย-อีสาน")}
                        >
                          ไทย-อีสาน
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <button
                          class="btn22 default"
                          value={cate}
                          onClick={(e) => setCate("ปลา")}
                        >
                          ปลา
                        </button>
                      </td>
                      <td>
                        <button
                          class="btn22 default"
                          value={cate2}
                          onClick={(e) => setCate2("เผ็ด")}
                        >
                          เผ็ด
                        </button>
                      </td>
                      <td>
                        <button
                          class="btn22 default"
                          value={cate3}
                          onClick={(e) => setCate3("ปิ้ง")}
                        >
                          ปิ้ง/ย่าง
                        </button>
                      </td>

                      <td>
                        <button
                          class="btn22 default"
                          value={cate5}
                          onClick={(e) => setCate5("ไทย-ใต้")}
                        >
                          ไทย-ใต้
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <button
                          class="btn22 default"
                          value={cate}
                          onClick={(e) => setCate("กุ้ง")}
                        >
                          กุ้ง
                        </button>
                      </td>
                      <td>
                        <button
                          class="btn22 default"
                          value={cate2}
                          onClick={(e) => setCate2("จืด")}
                        >
                          จืด
                        </button>
                      </td>
                      <td>
                        <button
                          class="btn22 default"
                          value={cate3}
                          onClick={(e) => setCate3("ทอด")}
                        >
                          ทอด
                        </button>
                      </td>

                      <td>
                        <button
                          class="btn22 default"
                          value={cate5}
                          onClick={(e) => setCate5("ต่างประเทศ")}
                        >
                          ต่างประเทศ
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <button
                          class="btn22 default"
                          value={cate}
                          onClick={(e) => setCate("หมึก")}
                        >
                          หมึก
                        </button>
                      </td>
                      <td></td>
                      <td>
                        <button
                          class="btn22 default"
                          value={cate3}
                          onClick={(e) => setCate3("นึ่ง")}
                        >
                          นึ่ง
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <button
                          class="btn22 default"
                          value={cate}
                          onClick={(e) => setCate("ไข่")}
                        >
                          ไข่
                        </button>
                      </td>
                      <td></td>
                      <td>
                        <button
                          class="btn22 default"
                          value={cate3}
                          onClick={(e) => setCate3("ไมโครเวฟ")}
                        >
                          ไมโครเวฟ
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </CardBody>
            </Card>
          </Col>

          <Col md="6">
            <Card className="ex1">
              <CardHeader>
                <CardTitle tag="h5">เมนู</CardTitle>
              </CardHeader>
              <CardBody>
                <Form>
                  <Row>
                    {Object.keys(Food).map((id) => {
                      return (
                        <Col md="4">
                          <div key={id}>
                            <Card>
                              <Card.Img
                                src={Food[id].image}
                                style={{ width: "150px", height: "100px" }}
                              />

                              <Card.Title
                                style={{
                                  display: "flex",
                                  justifyContent: "center",

                                  alignItems: "center",
                                }}
                                class="namefood"
                              >
                                {Food[id].name}
                              </Card.Title>
                            </Card>
                          </div>
                        </Col>
                      );
                    })}
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Menu;
