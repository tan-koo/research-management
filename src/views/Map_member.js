import React, { useState, useEffect, useContext } from 'react';
import firebaseApp from '../firebase.js';
import LDMap from 'components/LongdoMap/LDMap.js'
import { Redirect, useHistory } from 'react-router-dom'
import { AuthContext } from "components/Auth/Auth.js";
import { usePosition } from 'use-position';
import Popup from "views/Popup.js";
import $ from 'jquery';
// react plugin used to create charts
import { Line, Pie } from "react-chartjs-2";
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
// core components
import {
  dashboard24HoursPerformanceChart,
  dashboardEmailStatisticsChart,
  dashboardNASDAQChart,
} from "variables/charts.js";


function Map(){ 

    const { currentUser } = useContext(AuthContext);
    const { latitude, longitude, error } = usePosition();
    

    const [ Location, setLocation ] = useState({})
    const [ UserLocation, setUserLocation ] = useState('')
    const [ Road, setRoad ] = useState('')
    const [ Subdistrict, setSubdistrict ] = useState('')
    const [ District, setDistrict ] = useState('')
    const [ Province, setProvince ] = useState('')
    const [ Restaurant, setRestaurant ] = useState({})
    const [ RestaurantName, setRestaurantName ] = useState([])
    const [ Food, setFood ] = useState({})
    const [ LocationCheckText, setLocationCheckText ] = useState("กรุณารอสักครู่")
    const KMUTTLon = 100.496686;
    const KMUTTLat = 13.649337;

    const [ Food2, setFood2 ] = useState({})
    const [ FoodID, setFoodID ] = useState({})
    const [ RDFoodID, setRDFoodID ] = useState('unknown')
    const [ RDFoodIDCheck, setRDFoodIDCheck ] = useState(-1)
    const [ loading, setLoading ] = useState(false)
    const [ UserDoc, setUserDoc] = useState('')
    const [ UserRandomlist, setUserRandomlist] = useState({})
    const [ NRandom, setNRandom ] = useState(0)
    const [ NConfirm, setConfirm ] = useState(0)
    const history = useHistory()

    const [isOpen, setIsOpen] = useState(false);

    const togglePopup = () => {
      setIsOpen(!isOpen);
    }

    useEffect(() => {
      setTimeout(function() {
        alert('ฟังก์ชั่นนี้พร้อมใช้งานสำหรับผู้ใช้งานที่ใช้งานในบริเวณ"ประชาอุทิศ1 -ประชาอุทิศ50"')
      }, 200);
    }, [])
    

    $.ajax({ 
      url: "https://api.longdo.com/map/services/address?", 
      dataType: "jsonp", 
      type: "GET", 
      contentType: "application/json", 
      data: {
          key: "12a0ec23ac86a8c19e41937423f34e96",
          lon: longitude,
          lat: latitude,

            },
            success: function (results)
            {
              console.log(results)
              console.log(longitude)
              console.log(latitude)
              
              if (error) {  
                setLocationCheckText('กรุณากดยืนยันตำแหน่งแผนที่ก่อนใช้งาน')
              }
              
              setRoad(results ? results.road : LocationCheckText) 
              setSubdistrict(results ? results.subdistrict : "") 
              setDistrict(results ? results.district : "")
              setProvince(results ? results.province : "") 
              setUserLocation(results ? results.road : "")           
            }
          });

    

          useEffect(() => {
            if(UserLocation != "unknown"){
      
            //ใช้ firebaseApp.auth().onAuthStateChanged เพื่อใช้ firebaseApp.auth().currentUser โดยไม่ติด error เมื่อทำการ signout
            firebaseApp.auth().onAuthStateChanged(user => {
              var str = UserLocation;
              var res = str.split(" ");
              for(var i = 0; i < res.length; i++){
                res[i].split("");
                }
              var road_number = res[1]
              var road_number_add1 = +road_number + +'1';
              var road_number_add2 = +road_number + +'2';
              var road_number_minus1 = +road_number - +'1';
              var road_number_minus2 = +road_number - +'2';
              var road = res[0]+' '+res[1]
              var road1 = res[0]+' '+road_number_add1
              var road2 = res[0]+' '+road_number_add2
              var road3 = res[0]+' '+road_number_minus1
              var road4 = res[0]+' '+road_number_minus2
      
              const db = firebaseApp.firestore()
              const RestaurantCollection = db.collection('Restaurant').where('road' , 'in' , [road, road1, road2,road3, road4])       
        
              // subscription นี้จะเกิด callback กับทุกการเปลี่ยนแปลงของ collection Restaurant
              const unsubscribe = RestaurantCollection.onSnapshot(ss => {
                  // ตัวแปร local
                  const Restaurant = {}
                  const RestaurantName = []
        
                  ss.forEach(document => {
                      // manipulate ตัวแปร local
                      Restaurant[document.id] = document.data()
                      RestaurantName.push(Restaurant[document.id].name)
                  })
        
                  // เปลี่ยนค่าตัวแปร state
                  setRestaurant(Restaurant)
                  setRestaurantName(RestaurantName)
                  if(RestaurantName.length > 0){
                    
                  firebaseApp.auth().onAuthStateChanged(user => {
                    const db = firebaseApp.firestore()
                    const FoodCollection = db.collection('Food2').where('restaurant' , 'in' , RestaurantName)
              
                    // subscription นี้จะเกิด callback กับทุกการเปลี่ยนแปลงของ collection Food
                    const unsubscribe =  FoodCollection.onSnapshot(ss => {
                      // ตัวแปร local
                      const Food = {}
                      const FoodArray = []
            
                      ss.forEach(document => {
                          // manipulate ตัวแปร local
                          Food[document.id] = document.data()
                          FoodArray.push(Food[document.id])
                      })
            
                      // เปลี่ยนค่าตัวแปร state
                      var FoodSort = FoodArray.sort((a, b) => (a.restaurant > b.restaurant) ? 1 : -1)
                      console.log(FoodArray)
                      setFood(FoodSort)

                      const FoodCollection = db.collection('Food2').where('restaurant' , 'in' , RestaurantName)
        
                      // subscription นี้จะเกิด callback กับทุกการเปลี่ยนแปลงของ collection Food
                      const unsubscribe2 = FoodCollection.onSnapshot(ss => {
                          // ตัวแปร local
                          const Food2 = {}
                          const FoodID = []
                
                          ss.forEach(document => {
                              // manipulate ตัวแปร local
                              Food2[document.id] = document.data()
                              FoodID.push(document.id)
                          })
                
                          // เปลี่ยนค่าตัวแปร state
                          setFoodID(FoodID)
                        
                      })

                      const Food2Collection = db.collection('Food2').where('__name__', '==' , RDFoodID) 
        
                      // subscription นี้จะเกิด callback กับทุกการเปลี่ยนแปลงของ collection Food
                      const unsubscribe3 = Food2Collection.onSnapshot(ss => {
                          // ตัวแปร local
                          const Food2 = {}
                
                          ss.forEach(document => {
                              // manipulate ตัวแปร local
                              Food2[document.id] = document.data()
                          })
                
                          // เปลี่ยนค่าตัวแปร state
                          setFood2(Food2)
                          setLoading(false)
                      })
                  })
            
                  return () => {
                      // ยกเลิก subsciption เมื่อ component ถูกถอดจาก dom
                      unsubscribe()
                    }
                    });
                  }
              })
        
              return () => {
                  // ยกเลิก subsciption เมื่อ component ถูกถอดจาก dom
                  unsubscribe()
              }
              });
            }
          }, [UserLocation, RDFoodID])


    

          if(document.getElementById("RD") != null && document.getElementById("RDN") != null){
            if(RDFoodID == 'unknown'){
              document.getElementById("RD").style.display = 'inline';
              document.getElementById("RDN").style.display = 'none';
            } else {
              document.getElementById("RDN").style.display = 'inline';
              document.getElementById("RD").style.display = 'none';
            }
          }

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
        
        
        
          function RDFood() {
            
            setLoading(true)
            var rd = Math.floor(Math.random() * FoodID.length) 
            if(FoodID.length > 1){           
              for(var i=0; rd == RDFoodIDCheck; i++){
                    rd = Math.floor(Math.random() * FoodID.length)              
              }
            }
            setRDFoodIDCheck(rd)
            setRDFoodID(FoodID[rd])
            console.log('rd'+rd)
            console.log('rdc'+RDFoodIDCheck)
            N_Random()
            
            
          }
        
          async function Addlist(Foodname, id){
            const db = firebaseApp.firestore()
            const list = UserRandomlist
        
              
              if(list.length >= 9){
                list.shift()
              }
              list.push(Food2[id])
              const res = await db.collection('User').doc(UserDoc).update({
                'RandomList': list
              });
              alert('ระบบได้ทำการบันทึกประวัติแล้ว')
              setRDFoodID('unknown')
              FoodInteresting(id)
              N_Confirm()
                  
            
          }
        
          async function FoodInteresting(id){
            const db = firebaseApp.firestore()
            const FoodCollection = db.collection('Food2').where('__name__', '==' , id)
            // subscription นี้จะเกิด callback กับทุกการเปลี่ยนแปลงของ collection Food
            const unsubscribe = FoodCollection.onSnapshot(ss => {
              // ตัวแปร local
              const Food2 = {}
              const FoodData = []
              ss.forEach(document => {
                  // manipulate ตัวแปร local
                  Food2[document.id] = document.data()
                  FoodData.push(Food2[document.id].Interesting)
              })  
              })
              const res2 = await db.collection('Food2').doc(id).update({
                'Interesting': Food2[id].Interesting+1
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


          async function restaurantinterest(name, id,link){
            const db = firebaseApp.firestore()
              const res = await db.collection('Restaurant').doc(id).update({
                'Interesting': Restaurant[id].Interesting+1 
                
              });
            window.location.href = link;
          }
        




    if (!currentUser) {
        return <Redirect to="/general/home" />;
    }

    return (
      
      <>    
      

      <div className='content'>  
  
       

<Row style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
       
        }}>

<Col md="4">
              <Card className="card-user">
                <CardHeader  style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
       
        }}className="content">
                 
                </CardHeader>
                <CardBody>
                  <CardTitle style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
       
        }}className="content"><h5>ที่อยู่ปัจจุบันของคุณ</h5></CardTitle>
                  <Row>
                      <Col md="12">
                        <p>&nbsp;&nbsp;&nbsp;&nbsp;<img
                 alt="..."
                 src={require("assets/img/location.png")}
                 className="photo1"
               />&nbsp;&nbsp;&nbsp;&nbsp;{Road} {Subdistrict} {District} {Province}</p>
   
                        
                      </Col>
                    </Row>
                  
                </CardBody>
              </Card>
            </Col>
            <Col md="4">
              <Card className="ex2">
                <CardHeader  style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
       
        }}className="content">
                 
                </CardHeader>
                <CardBody>
                  <CardTitle style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
       
        }}className="content"><h5>ร้านอาหารที่ใกล้เคียง</h5 ></CardTitle>
        
                  <Row>
                      <Col md="12">


{ Object.keys(Restaurant).map((id) => {
  return<Row style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
 
  }}className="content">
        <p >&nbsp;&nbsp;&nbsp;&nbsp;<img
                 alt="..."
                 src={require("assets/img/restaurant.png")}
                 className="photo1"
               />&nbsp;&nbsp;&nbsp;&nbsp;{Restaurant[id].name}-{Restaurant[id].road}&nbsp;&nbsp;&nbsp;&nbsp;<button class="btn22 default" onClick={e =>restaurantinterest(Restaurant[id].name, id,Restaurant[id].link)}><img
                 alt="..."
                 src={require("assets/img/gg.png")}
                 className="photo1"
               /></button></p>
             
        </Row>
}) } 

                        
                      </Col>
                    </Row>
                  
                </CardBody>
              </Card>
            </Col>
            <Col md="4">
              <Card className="ex2">
                <CardHeader  style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
       
        }}className="content">
                 
                </CardHeader>
                <CardBody>
                  <Form >
                  <CardTitle style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
       
        }}className="content"><h5>เมนู</h5></CardTitle>
                  <Row>
                      <Col md="12">
                        <FormGroup>

{ Object.keys(Food).map((id) => {
  return<Row>
     <p>&nbsp;&nbsp;&nbsp;&nbsp;<img
                 alt="..."
                 src={require("assets/img/ff.png")}
                 className="photo1"
               />&nbsp;&nbsp;&nbsp;&nbsp;{Food[id].name}-{Food[id].restaurant}</p>
        </Row>
}) }   </FormGroup>
                        
                      </Col>
                    </Row>
                  
                  </Form>
                </CardBody>
              </Card>
            </Col>

       </Row>
       <Row style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
       
        }} ><Col md="4">
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
  { Object.keys(Food2).map((id) => {  
    return<CardBody id='RDN'>
            <Form >
            <CardTitle style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
 
  }}className="content"><h2>{Food2[id].name}</h2></CardTitle>
            <Row>
                <Col md="12">

                <img alt="..." src={Food2[id].image} style={{ width : '250px', height: '250px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}/>
                
              
                </Col>
              </Row>
              <Row>
                <Col md="12">
          
            
                </Col>
              </Row>
           
              <Row>
         
              </Row>
      
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
                    value={Food2[id].name} onClick={e =>Addlist(e.target.value, id)}
                    
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
</Row>

{isOpen && <Popup
      content={<>
<h4>ฟังก์ชั่นนี้พร้อมใช้งานสำหรับผู้ใช้งานที่ใช้งานในบริเวณ"ประชาอุทิศ1 -ประชาอุทิศ50"</h4>   
      </>}
      handleClose={togglePopup}     
/>}



       </div>


      
      </>
    );
}

export default Map;