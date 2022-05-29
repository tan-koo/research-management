/*!

=========================================================
* Paper Dashboard React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useState, useEffect, useContext } from 'react';
import firebaseApp from '../firebase.js';
import { Redirect } from 'react-router-dom'
import { AuthContext } from "components/Auth/Auth.js";
import Carousel from 'react-bootstrap/Carousel'
import brain from 'brain.js/src';
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
} from "reactstrap";
import {
  AwesomeButton,
  AwesomeButtonProgress,
  AwesomeButtonSocial,
} from 'react-awesome-button';

function Random(){ 

  const { currentUser } = useContext(AuthContext);
  const [ Food, setFood ] = useState({})
  const [ FoodID, setFoodID ] = useState({})
  const [ NRandom, setNRandom ] = useState(0)
  const [ NConfirm, setConfirm ] = useState(0)
  const [ RDFoodID, setRDFoodID ] = useState('unknown')
  const [ RDFoodIDCheck, setRDFoodIDCheck ] = useState(-1)
  const [ loading, setLoading ] = useState(false)
  const [ UserDoc, setUserDoc] = useState('')
  const [ UserRandomlist, setUserRandomlist] = useState({})
  const [ FoodInterest, setFoodInterest] = useState(0)
  const [ UserRDCateCount, setUserRDCateCount] = useState({หมู:0})
  const [ AllRandomCate, setAllRandomCate] = useState([[], [], [], []])
  const [ RDC, setRDC] = useState(0)
  const [ Load, setLoad ] = useState('')
  const [ checkload, setcheckload ] = useState(false)


  useEffect(() => {
    if(checkload == false){
      firebaseApp.auth().onAuthStateChanged(user => {
        const db = firebaseApp.firestore()
        const userCollection = db.collection('User').where('Uid' , '==' , firebaseApp.auth().currentUser.uid)        
      // subscription นี้จะเกิด callback กับทุกการเปลี่ยนแปลงของ collection Food
      const unsubscribe = userCollection.onSnapshot(ss => {
          // ตัวแปร local
          const User = {}
          const UserRD = []
  
          ss.forEach(document => {
            // manipulate ตัวแปร local
            User[document.id] = document.data()
            UserRD.push(User[document.id].RandomList)
        })
          var UserRDCate = []
          for(var i = 0 ; i < UserRD[0].length ; i++){
            UserRDCate = UserRDCate.concat(UserRD[0][i].cate)
          }
  
          var UserRDCateCount = {หมู:0, ไก่:0, เนื้อวัว:0, ปลา:0, กุ้ง:0, หมึก:0, ไข่:0, เปรี้ยว:0, หวาน:0, เค็ม:0, เผ็ด:0, จืด:0, นึ่ง:0, ต้ม:0, ผัด:0, ตุ๋น:0, ปิ้ง:0, ทอด:0, ไมโครเวฟ:0, 'ไทย-กลาง':0, 'ไทย-เหนือ':0, 'ไทย-อีสาน':0, 'ไทย-ใต้':0, ต่างประเทศ:0}
          for(var i = 0 ; i < UserRDCate.length ; i++){
            UserRDCateCount[`${ UserRDCate[i] }`] = UserRDCateCount[`${ UserRDCate[i] }`]+1
          }
          const RecomCollection = db.collection('FoodRecom').limit(10)
  
          // subscription นี้จะเกิด callback กับทุกการเปลี่ยนแปลงของ collection Food
          const unsubscribe = RecomCollection.onSnapshot(ss => {
            // ตัวแปร local
            const Recom = []
     
            ss.forEach(document => {
                // manipulate ตัวแปร local
                Recom.push(document.data())
    
            })
    
          var net = new brain.NeuralNetwork();
    
          net.train(Recom);
    
          console.log(UserRDCateCount);
          var output = net.run(UserRDCateCount);
          console.log(output);
          setcheckload(true)
          const outputarray = Object.entries(output).sort((a,b) => b[1]-a[1]);
          var Staple = []
          var Taste = []
          var Method = []
          var Nation = []
          for(var i = 0 ; i < outputarray.length ; i++){
            if(outputarray[i][0] == 'หมู' || outputarray[i][0] == 'ไก่' || outputarray[i][0] == 'เนื้อวัว' || outputarray[i][0] == 'ปลา' || outputarray[i][0] == 'กุ้ง' || outputarray[i][0] == 'หมึก' || outputarray[i][0] == 'ไข่'){
              Staple.push([outputarray[i][0],Math.floor(outputarray[i][1]*10)])
            }
            if(outputarray[i][0] == 'เปรี้ยว' || outputarray[i][0] == 'หวาน' || outputarray[i][0] == 'เค็ม' || outputarray[i][0] == 'เผ็ด' || outputarray[i][0] == 'จืด'){
              Taste.push([outputarray[i][0],Math.floor(outputarray[i][1]*10)])
            }
            if(outputarray[i][0] == 'ต้ม' || outputarray[i][0] == 'ผัด' || outputarray[i][0] == 'ตุ๋น' || outputarray[i][0] == 'ปิ้ง' || outputarray[i][0] == 'ทอด' || outputarray[i][0] == 'นึ่ง' || outputarray[i][0] == 'ไมโครเวฟ'){
              Method.push([outputarray[i][0],Math.floor(outputarray[i][1]*10)])
            }
            if(outputarray[i][0] == 'ไทย-กลาง' || outputarray[i][0] == 'ไทย-เหนือ' || outputarray[i][0] == 'ไทย-อีสาน' || outputarray[i][0] == 'ไทย-ใต้' || outputarray[i][0] == 'ต่างประเทศ'){
              Nation.push([outputarray[i][0],Math.floor(outputarray[i][1]*10)])
            }
          }
          var StapleRandomCate = []
          var TasteRandomCate = []
          var MethodRandomCate = []
          var NationRandomCate = []
          for(var i = 0 ; i < Staple.length ; i++){
            for(var j = 0 ; j < Staple[i][1] ; j++){
              StapleRandomCate.push(Staple[i][0])
            }
          }
          for(var i = 0 ; i < Taste.length ; i++){
            for(var j = 0 ; j < Taste[i][1] ; j++){
              TasteRandomCate.push(Taste[i][0])
            }
          }
          for(var i = 0 ; i < Method.length ; i++){
            for(var j = 0 ; j < Method[i][1] ; j++){
              MethodRandomCate.push(Method[i][0])
            }
          }
          for(var i = 0 ; i < Nation.length ; i++){
            for(var j = 0 ; j < Nation[i][1] ; j++){
              NationRandomCate.push(Nation[i][0])
            }
          }
          var AllRandomCate = []
          AllRandomCate.push(StapleRandomCate)
          AllRandomCate.push(TasteRandomCate)
          AllRandomCate.push(MethodRandomCate)
          AllRandomCate.push(NationRandomCate)
    
          setAllRandomCate(AllRandomCate)
          //var outputsort = {หมู:output['หมู'], ไก่:output['ไก่'], เนื้อวัว:output['เนื้อวัว'], ปลา:output['ปลา'], กุ้ง:output['กุ้ง'], หมึก:output['หมึก'], ไข่:output['ไข่'], เปรี้ยว:output['เปรี้ยว'], หวาน:output['หวาน'], เค็ม:output['เค็ม'], เผ็ด:output['เผ็ด'], จืด:output['จืด'], นึ่ง:output['นึ่ง'], ต้ม:output['ต้ม'], ผัด:output['ผัด'], ตุ๋น:output['ตุ๋น'], ปิ้ง:output['ปิ้ง'], ทอด:output['ทอด'], ไมโครเวฟ:output['ไมโครเวฟ'], 'ไทย-กลาง':output['ไทย-กลาง'], 'ไทย-เหนือ':output['ไทย-เหนือ'], 'ไทย-อีสาน':output['ไทย-อีสาน'], 'ไทย-ใต้':output['ไทย-ใต้'], ต่างประเทศ:output['ต่างประเทศ']}
        })
      })
  
      });
    }
    else{
      console.log('555')
    }
  }, [])


  useEffect(() => {
    //ใช้ firebaseApp.auth().onAuthStateChanged เพื่อใช้ firebaseApp.auth().currentUser โดยไม่ติด error เมื่อทำการ signout
    firebaseApp.auth().onAuthStateChanged(user => {

      var r1 = Math.floor(Math.random() * 4)
      var r2 = Math.floor(Math.random() * 4)
      for(var i = 0 ; r1 == r2 ; i++){
        r2 = Math.floor(Math.random() * 4)
      }

      //var check = ['หมู','ไก่','เปรี้ยว','เค็ม','ผัด','ตุ๋น','ทอด','ไทย-กลาง']

      var cate1 = AllRandomCate[r1][Math.floor(Math.random() * AllRandomCate[r1]['length'])]
      var cate2 = AllRandomCate[r2][Math.floor(Math.random() * AllRandomCate[r2]['length'])]

      //for(var i = 0 ; check.includes(cate1) == false; i++){
      //  cate1 = AllRandomCate[r1][Math.floor(Math.random() * AllRandomCate[r1]['length'])]
      //}
      //for(var i = 0 ; check[r2].includes(cate2) == false || i < 20; i++){
      //  cate2 = AllRandomCate[r2][Math.floor(Math.random() * AllRandomCate[r2]['length'])]
      //}
      if(cate1 == undefined){
        cate1 = AllRandomCate[r1][Math.floor(Math.random() * AllRandomCate[r1]['length'])]
      }
      if(cate1 == undefined){
        cate1 = AllRandomCate[r1][Math.floor(Math.random() * AllRandomCate[r1]['length'])]
      }
      if(cate1 == undefined){
        cate1 = AllRandomCate[r1][Math.floor(Math.random() * AllRandomCate[r1]['length'])]
      }
      if(cate1 == undefined){
        cate1 = AllRandomCate[r1][Math.floor(Math.random() * AllRandomCate[r1]['length'])]
      }
      if(cate1 == undefined){
        cate1 = '@'
        //cate2 = '@'
      }

      console.log(cate1+'+'+cate2)
      
      const db = firebaseApp.firestore()
      const FoodCollection = db.collection('Food2').where('BLsearchkey.'+cate1 , '==' , true).where('BLsearchkey.'+cate2 , '==' , true)//.where('searchkey', 'array-contains-any', ['@',cate1])//.where('BLsearchkey.'+cate1 , '==' , true).where('BLsearchkey.'+cate2 , '==' , true)

      // subscription นี้จะเกิด callback กับทุกการเปลี่ยนแปลงของ collection Food
      const unsubscribe = FoodCollection.onSnapshot(ss => {
          // ตัวแปร local
          const FoodID = []

          ss.forEach(document => {
              // manipulate ตัวแปร local
              Food[document.id] = document.data()
              FoodID.push(document.id)
          })

          // เปลี่ยนค่าตัวแปร state
          setFoodID(FoodID)
          console.log(FoodID)
          
          //console.log('RDFoodID')
          //console.log(RDFoodID)

      })

      });
  }, [RDC])


  useEffect(() => {
    //ใช้ firebaseApp.auth().onAuthStateChanged เพื่อใช้ firebaseApp.auth().currentUser โดยไม่ติด error เมื่อทำการ signout
    firebaseApp.auth().onAuthStateChanged(user => {
        const db = firebaseApp.firestore()
        const userCollection = db.collection('User').where('Uid' , '==' , firebaseApp.auth().currentUser.uid)        
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
          
          setUserRandomlist(UserData[0].RandomList)
          setUserDoc(UserDoc[0])
      })

      return () => {
          // ยกเลิก subsciption เมื่อ component ถูกถอดจาก dom
          unsubscribe()
      }
      });
  }, [])

  if(document.getElementById("RD") != null && document.getElementById("RDN") != null){
    if(RDFoodID == 'unknown'){
      document.getElementById("RD").style.display = 'inline';
    } else {
      document.getElementById("RDN").style.display = 'inline';
      document.getElementById("RD").style.display = 'none';
    }
  }


  function RDFood() {
    setLoad('กรุณารอสักครู่...')        
    setRDC(RDC+1)


      var rd = Math.floor(Math.random() * FoodID.length) 
      setRDFoodIDCheck(rd)
      setRDFoodID(FoodID[rd])
      console.log(FoodID[rd])
      //console.log('rd'+rd)
      //console.log('rdc'+RDFoodIDCheck)
      N_Random()

      if(FoodID['length'] == 0){
        const db = firebaseApp.firestore()
        const FoodCollection = db.collection('Food2') 
  
        // subscription นี้จะเกิด callback กับทุกการเปลี่ยนแปลงของ collection Food
        const unsubscribe = FoodCollection.onSnapshot(ss => {
            // ตัวแปร local
            const Food = {}
  
            ss.forEach(document => {
                // manipulate ตัวแปร local
                Food[document.id] = document.data()
            })
  
            // เปลี่ยนค่าตัวแปร state
            setFood(Food)
        })
      }
      if(FoodID['length'] != 0){
        const db = firebaseApp.firestore()
        const FoodCollection = db.collection('Food2').where('__name__', '==' , FoodID[rd]) 
  
        // subscription นี้จะเกิด callback กับทุกการเปลี่ยนแปลงของ collection Food
        const unsubscribe = FoodCollection.onSnapshot(ss => {
            // ตัวแปร local
            const Food = {}
  
            ss.forEach(document => {
                // manipulate ตัวแปร local
                Food[document.id] = document.data()
            })
  
            // เปลี่ยนค่าตัวแปร state
            setFood(Food)
        })
      }
      



    

    setTimeout(function() {
      setLoad('') 
    }, 300);
    
    
  }

  async function Addlist(Foodname, id){
    const db = firebaseApp.firestore()
    const list = UserRandomlist

      
      if(list.length >= 9){
        list.shift()
      }
      list.push(Food[id])
      const res = await db.collection('User').doc(UserDoc).update({
        'RandomList': list
      });
      alert('ระบบได้ทำการบันทึกประวัติแล้ว')
      setRDFoodID('unknown')
      document.getElementById("RDN").style.display = 'none';
      FoodInteresting(id)
      N_Confirm()
      FoodRecom(id)
      
  }

  async function FoodRecom(id) {
    const db = firebaseApp.firestore()
    const FoodRecomCollection = db.collection('FoodRecom')
    const input = UserRDCateCount
    const FoodCate = Food[id].cate

    var output = {หมู:0, ไก่:0, เนื้อวัว:0, ปลา:0, กุ้ง:0, หมึก:0, ไข่:0, เปรี้ยว:0, หวาน:0, เค็ม:0, เผ็ด:0, จืด:0, นึ่ง:0, ต้ม:0, ผัด:0, ตุ๋น:0, ปิ้ง:0, ทอด:0, ไมโครเวฟ:0, 'ไทย-กลาง':0, 'ไทย-เหนือ':0, 'ไทย-อีสาน':0, 'ไทย-ใต้':0, ต่างประเทศ:0}
    for(var i = 0 ; i < FoodCate.length ; i++){
      output[`${ FoodCate[i] }`] = output[`${ FoodCate[i] }`]+1
    }
    // insert และคืน document reference
    const documentRef = await FoodRecomCollection.add({
      input,
      output,
    })
}

  async function FoodInteresting(id){
    const db = firebaseApp.firestore()
    const FoodCollection = db.collection('Food2').where('__name__', '==' , id)
    // subscription นี้จะเกิด callback กับทุกการเปลี่ยนแปลงของ collection Food
    const unsubscribe = FoodCollection.onSnapshot(ss => {
      // ตัวแปร local
      const FoodData = []
      ss.forEach(document => {
          // manipulate ตัวแปร local
          Food[document.id] = document.data()
          FoodData.push(Food[document.id].Interesting)
      })  
      })
      const res2 = await db.collection('Food2').doc(id).update({
        'Interesting': Food[id].Interesting+1
      });
  }

  useEffect(() => {
    //ใช้ firebaseApp.auth().onAuthStateChanged เพื่อใช้ firebaseApp.auth().currentUser โดยไม่ติด error เมื่อทำการ signout
    firebaseApp.auth().onAuthStateChanged(user => {
      const db = firebaseApp.firestore()
      const DBCollection = db.collection('Dashboard')
      // subscription นี้จะเกิด callback กับทุกการเปลี่ยนแปลงของ collection Food
      const unsubscribe = DBCollection.onSnapshot(ss => {
        // ตัวแปร local
        const DB = {}
        ss.forEach(document => {
            // manipulate ตัวแปร local
            DB['RandomFood'] = document.data()
        }) 
          setNRandom(DB.RandomFood.N_Random)
          setConfirm(DB.RandomFood.N_Confirm)
        })

      return () => {
          // ยกเลิก subsciption เมื่อ component ถูกถอดจาก dom
          unsubscribe()
      }
      });
  }, [NRandom, NConfirm])

  async function N_Random(){
    const db = firebaseApp.firestore()
      const res2 = await db.collection('Dashboard').doc('RandomFood').update({
        'N_Random': NRandom+1
      });
  }

  async function N_Confirm(){
    const db = firebaseApp.firestore()
      const res2 = await db.collection('Dashboard').doc('RandomFood').update({
        'N_Confirm': NConfirm+1
      });
  }

  if (!currentUser) {
      return <Redirect to="/general/random" />;
  }

    return (
      <>
     <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
       
        }}className="content">
        <Col md="6">
              <Card className="card-user">
                <CardHeader  style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
       
        }}className="content">
                 
                </CardHeader>
                <CardBody id='RD'>
                  <Form >
                  <CardTitle style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
       
        }}className="content"><h5>มื้อนี้กินอะไรดี ?</h5></CardTitle>
                  <Row>
                      <Col md="12">
                      <img
                 alt="..."
                 src="https://res.cloudinary.com/daxwfdlwj/image/upload/v1620030749/Food/giphy_w79qht.gif"
                 
               />
                    
                      </Col>
                    </Row>
                    <Row>
                      <Col md="12">
                
                  
                      </Col>
                    </Row>
                 
                    <Row>
               
                    </Row>
                    <CardTitle style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
       
        }}className="content"><h3>{Load}</h3></CardTitle>
                    <Row>
                      <div className="update ml-auto mr-auto">
                        <Button
                          className="btn23"
                          color="red"
                          onClick={RDFood}
                          
                        >
                        สุ่มอาหาร
                        </Button>
                      </div>
                    </Row>
                  </Form>
                  
       
                </CardBody>
        { Object.keys(Food).map((id) => {  
          return<CardBody id='RDN' style={{ display: 'none'}}>
                  <Form >
                  <CardTitle style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
       
        }}className="content"><h2>{Food[id].name}</h2></CardTitle>
                  <Row>
                      <Col md="12">

                      <img alt="..." src={Food[id].image} style={{ width : '250px', height: '250px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}/>

                    
                      </Col>
                    </Row>
                    <Row>
                      <Col md="12">
                
                  
                      </Col>
                    </Row>
                 
                    <Row>
               
                    </Row>
                    <CardTitle style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
       
        }}className="content"><h3>{Load}</h3></CardTitle>
                    <Row>
                    <div className="update ml-auto mr-auto">
                        <Button
                          className="btn23"
                          color="warning"
                          onClick={RDFood}
                          
                        >
                        สุ่มใหม่
                        </Button>
                      </div>
                      <div className="update ml-auto mr-auto">
                        <Button
                          className="btn23"
                          color="success"
                          value={Food[id].name} onClick={e =>Addlist(e.target.value, id)}
                          
                        >
                        ยืนยัน
                        </Button>
                      </div>
                    </Row>
                  </Form>
                  
       
                </CardBody>
          }) }
              </Card>
            </Col>

           

        </div>
        
      </>
    );
}

export default Random;