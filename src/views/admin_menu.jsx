import React, { useState, useEffect, useContext } from "react";
import firebaseApp from "../firebase.js";
import { Redirect } from "react-router-dom";
import { AuthContext } from "components/Auth/Auth.js";
import Insertmenu from "views/insertmenu.jsx";
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

export const AppContext = React.createContext();
function Dashboard() {
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
  const userCollection = db.collection("Food2");

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
        console.log(search);
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

  function deleteDocument(id) {
    // ประกาศตัวแปรเพื่ออ้างอิงไปยัง document ที่จะทำการลบ
    const documentRef = userCollection.doc(id);
    // ลบ document
    documentRef.delete();

    alert(`document ${id} has been deleted`);
  }

  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <AppContext.Provider value={{ search }}>
              <Insertmenu />
            </AppContext.Provider>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Dashboard;
