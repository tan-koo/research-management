import React, { useState, useEffect, useContext } from 'react';
import firebaseApp from '../firebase.js';
import { Redirect } from 'react-router-dom'
import { AuthContext } from "components/Auth/Auth.js";
import { Link } from 'react-router-dom';
import { Line, Pie } from "react-chartjs-2";
// reactstrap components
import { Col, Card, Row} from "react-bootstrap";
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


function Dashboard(){ 
    // ประกาศตัวแปร state
    const [ Food, setFood ] = useState({})
    const [ Food2, setFood2 ] = useState({})
    const [ cate, setCate] = useState('')
    const [ cate2, setCate2] = useState('')
    const [ cate3, setCate3] = useState('')
    const [ cate4, setCate4] = useState('')
    const [ cate5, setCate5] = useState('')
    const [ search, setSearch] = useState('')
    const [ UserDoc, setUserDoc] = useState('')
    const [ UserFoodlist, setUserFoodlist] = useState({})
    const [ listupdate, setlistupdate ] = useState(0)

    const [ Food3, setFood3 ] = useState({})
    const [ FoodID, setFoodID ] = useState([])
    const [ Food2ID, setFood2ID ] = useState([])
    const [ MyFood, setMyFood ] = useState({})
    const [ DBFood, setDBFood ] = useState({})
    const [ MyFoodID, setMyFoodID ] = useState([])
    const [ RDFoodID, setRDFoodID ] = useState('unknown')
    const [ RDFoodIDCheck, setRDFoodIDCheck ] = useState(-1)
    const [ loading, setLoading ] = useState(false)
    const [ UserRandomlist, setUserRandomlist] = useState({})
    const [ NRandom, setNRandom ] = useState(0)
    const [ NConfirm, setConfirm ] = useState(0)

    const [name, setname] = useState('')
    const [Uid, setUid] = useState(firebaseApp.auth().currentUser.uid)

    // ประกาศตัวแปรเพื่ออ้างอิง user collection
    const db = firebaseApp.firestore()
    const Collection = db.collection('Food2')
    let s = 'BLsearchkey.'+search
    let c1 = 'BLsearchkey.'+cate
    let c2 = 'BLsearchkey.'+cate2
    let c3 = 'BLsearchkey.'+cate3
    let c4 = 'BLsearchkey.'+cate4
    let c5 = 'BLsearchkey.'+cate5
    let catecheck = 'BLsearchkey.@'
    //แก้บัค
    if(search == ''){s = 'BLsearchkey.@'}
    if(cate == ''){c1 = 'BLsearchkey.@'}
    if(cate2 == ''){c2 = 'BLsearchkey.@'}
    if(cate3 == ''){c3 = 'BLsearchkey.@'}
    if(cate4 == ''){c4 = 'BLsearchkey.@'}
    if(cate5 == ''){c5 = 'BLsearchkey.@'}
    if(s == 'BLsearchkey.@' && c1 == 'BLsearchkey.@' && c2 == 'BLsearchkey.@' && c3 == 'BLsearchkey.@' && c4 == 'BLsearchkey.@' && c5 == 'BLsearchkey.@'){catecheck = 'BLsearchkey.Close'}
    else{catecheck = 'BLsearchkey.@'}
    const CateCollection = Collection.where(s , '==' , true)
                                      .where(c1 , '==' , true)
                                      .where(c2 , '==' , true)
                                      .where(c3 , '==' , true)
                                      .where(c4 , '==' , true)
                                      .where(c5 , '==' , true)
                                      .where(catecheck , '==' , true)
    //const SearchCollection = CateCollection.orderBy("name").startAt(search).endAt(search + "\uf8ff")
    
    useEffect(() => {
        // subscription นี้จะเกิด callback กับทุกการเปลี่ยนแปลงของ collection Food
        const unsubscribe =  CateCollection.onSnapshot(ss => {
            // ตัวแปร local
            const Food = {}

            ss.forEach(document => {
                // manipulate ตัวแปร local
                Food[document.id] = document.data()
            })

            // เปลี่ยนค่าตัวแปร state
            setFood(Food)
        })

        return () => {
            // ยกเลิก subsciption เมื่อ component ถูกถอดจาก dom
            unsubscribe()
        }
    }, [s, c1, c2, c3, c4, c5])//เมื่อค่า cate เปลี่ยนจะทำการอัพเดท useEffect ใหม่ #ไอห่า หาเป็นวันกว่าจะได้ 

    function clearall() {
      setSearch("")
      setCate("")
      setCate2("")
      setCate3("")
      setCate4("")
      setCate5("")
    }

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
            setUserFoodlist(UserData[0].FoodList)
            setUserDoc(UserDoc[0])

            const FoodCollection = db.collection('Food2').where('__name__' , 'in' , UserData[0].FoodList.concat(['none']))
  
            // subscription นี้จะเกิด callback กับทุกการเปลี่ยนแปลงของ collection Food
            const unsubscribe =  FoodCollection.onSnapshot(ss => {
              // ตัวแปร local
              const Food2 = {}
              const Food2ID = []
              ss.forEach(document => {
                  // manipulate ตัวแปร local
                  Food2[document.id] = document.data()
                  Food2ID.push(document.id)
              })

              setFood2ID(Food2ID)
              const Food3Collection = db.collection('Food2').where('__name__' , 'in' , UserData[0].FoodList.concat(['none']))
        
              // subscription นี้จะเกิด callback กับทุกการเปลี่ยนแปลงของ collection Food
              const unsubscribe2 = Food3Collection.onSnapshot(ss => {
                  // ตัวแปร local
                  const Food3 = {}
                  const FoodID = []
        
                  ss.forEach(document => {
                      // manipulate ตัวแปร local
                      Food3[document.id] = document.data()
                      FoodID.push(document.id)
                  })
                  setDBFood(Food3)

                
                  const MyCollection = db.collection('MyFood').where('Uid', '==' , firebaseApp.auth().currentUser.uid) 
    
                  // subscription นี้จะเกิด callback กับทุกการเปลี่ยนแปลงของ collection Food
                  const unsubscribe4 = MyCollection.onSnapshot(ss => {
                      // ตัวแปร local
                      const MyFoodID = []
                      const MyFood = {}
            
                      ss.forEach(document => {
                          // manipulate ตัวแปร local
                          Food2[document.id] = document.data()
                          MyFood[document.id] = document.data()
                          FoodID.push(document.id)
                          MyFoodID.push(document.id)
                      })
                      setFood2(Food2)
                      setMyFood(MyFood)
                      setFoodID(FoodID)
                      setMyFoodID(MyFoodID)
                      
                  })
              })
          })
          return () => {
            // ยกเลิก subsciption เมื่อ component ถูกถอดจาก dom
            unsubscribe()
        }
        })
        });
    }, [listupdate])

    useEffect(() => {
      //ใช้ firebaseApp.auth().onAuthStateChanged เพื่อใช้ firebaseApp.auth().currentUser โดยไม่ติด error เมื่อทำการ signout
      firebaseApp.auth().onAuthStateChanged(user => {
          const db = firebaseApp.firestore()
          const userCollection = db.collection('User').where('Uid' , '==' , firebaseApp.auth().currentUser.uid)        
        // subscription นี้จะเกิด callback กับทุกการเปลี่ยนแปลงของ collection Food
        const unsubscribe = userCollection.onSnapshot(ss => {
            // ตัวแปร local
            const User = {}
            const UserData = []
  
            ss.forEach(document => {
              // manipulate ตัวแปร local
              User[document.id] = document.data()
              UserData.push(User[document.id])

          })
            
            setUserRandomlist(UserData[0].RandomList)
        })
  
        return () => {
            // ยกเลิก subsciption เมื่อ component ถูกถอดจาก dom
            unsubscribe()
        }
        });
    }, [])

    async function Addlistt(id) {
      if(UserFoodlist['length'] < 9){
        if(UserFoodlist.includes(id) == false){
          
          const list = UserFoodlist
          list.push(id)
          const res = await db.collection('User').doc(UserDoc).update({
            'FoodList': list
          });
        } else {
          alert('รายการนี้อยู่ในลิสต์ของคุณอยู่แล้ว')
        }
      } else {
        alert('ลิสต์ของคุณเต็มแล้ว')
      }
    }


    
    async function Deletelist(id) {

        if(MyFoodID.includes(id) == false){
          const list = UserFoodlist
          const index = list.indexOf(id);
          if (index > -1) {
            list.splice(index, 1);
          }
          const res = await db.collection('User').doc(UserDoc).update({
            'FoodList': list
          });
          setRDFoodID('unknown')
        }
  
        if(Food2ID.includes(id) == false){
          const FoodCollection = db.collection('MyFood')
          const documentRef = FoodCollection.doc(id)
          // ลบ document
          documentRef.delete()
          const count = listupdate+1
          setlistupdate(count)
          setRDFoodID('unknown')
        }
    }

    function RDFood() {
      if(FoodID.length == 0){
        alert('ไม่มีอาหารอยู่ในลิสต์ของคุณ')
        setRDFoodID('unknown')
      } else {

      
        setLoading(true)
        var rd = Math.floor(Math.random() * FoodID.length) 
        if(FoodID.length > 1){           
          for(var i=0; rd == RDFoodIDCheck; i++){
                rd = Math.floor(Math.random() * FoodID.length)              
          }
        }
        setRDFoodID(FoodID[rd])
        setRDFoodIDCheck(rd)
        console.log('rd'+rd)
        console.log('rdc'+RDFoodIDCheck)
        console.log(RDFoodID)
        N_Random()
        SearchFood(FoodID[rd])
      }
      
    }

    function SearchFood(FoodID){
      if(MyFoodID.includes(FoodID) == false){
        const Food2Collection = db.collection('Food2').where('__name__', '==' , FoodID) 

        // subscription นี้จะเกิด callback กับทุกการเปลี่ยนแปลงของ collection Food
        const unsubscribe3 = Food2Collection.onSnapshot(ss => {
            // ตัวแปร local
            const Food3 = {}
  
            ss.forEach(document => {
                // manipulate ตัวแปร local
                Food3[document.id] = document.data()
            })
  
            // เปลี่ยนค่าตัวแปร state
            setFood3(Food3)
            setLoading(false)
        })
      }

      if(Food2ID.includes(FoodID) == false){
        const Food2Collection = db.collection('MyFood').where('__name__', '==' , FoodID) 

        // subscription นี้จะเกิด callback กับทุกการเปลี่ยนแปลงของ collection Food
        const unsubscribe3 = Food2Collection.onSnapshot(ss => {
            // ตัวแปร local
            const Food3 = {}
  
            ss.forEach(document => {
                // manipulate ตัวแปร local
                Food3[document.id] = document.data()
            })
  
            // เปลี่ยนค่าตัวแปร state
            setFood3(Food3)
            setLoading(false)
        })
      }
    }

  
    async function Addlist(Foodname, id){
      const db = firebaseApp.firestore()
      const listt = UserRandomlist
        
        if(listt.length >= 9){
          listt.shift()
        }
        listt.push(Food2[id])
        const res = await db.collection('User').doc(UserDoc).update({
          'RandomList': listt
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

    async function insertDocument() {
      const db = firebaseApp.firestore()
      const userCollection = db.collection('MyFood')

      if(name != ""){
        const documentRef = await userCollection.add({
          name,
          Uid,
          image:'https://res.cloudinary.com/daxwfdlwj/image/upload/v1619778865/Food/bb_cwkoef.gif',
          restaurant:'',
          searchkey:[],
          BLsearchkey:{},
          cate:[],
          Interesting:0
        })
      }
      if(name == ""){
        alert('กรุณาใส่ชื่ออาหาร')
      }
  }


    const { currentUser } = useContext(AuthContext);

    if (!currentUser) {
        return <Redirect to="/general/login" />;
    }

    return (
      
      <>
        <div className="content">   
              <Row>
              <Col md="6">
             
             <Card  className="card-user" >
               <CardHeader>
                 <CardTitle tag="h5">เลือกเมนูอาหารตามหมวดหมู่ <button class="btn22 default pull-right"onClick={clearall}> ล้างหมวดหมู่ที่เลือกทั้งหมด</button></CardTitle>
                 
               </CardHeader>
               <CardBody>
                 
               <table class="table table-borderless">
               <thead class="thead-dark">
               <tr>
     

     <th scope="col">  <img
                alt="..."
                src="https://res.cloudinary.com/daxwfdlwj/image/upload/v1620029352/Food/meat_cu5jle.png"
                className="photo"
              /> วัตถุดิบ {cate}</th>
     <th scope="col"><img
                alt="..."
                src="https://res.cloudinary.com/daxwfdlwj/image/upload/v1620030561/Food/taste_vmf85w.png"
                className="photo"
              /> รสชาติ {cate2}</th>
     <th scope="col"><img
                alt="..."
                src="https://res.cloudinary.com/daxwfdlwj/image/upload/v1620030614/Food/boiling_e9dr1o.png"
                className="photo"
              /> วิธีการ {cate3}</th>
     
     <th scope="col"><img
                alt="..."
                src="https://res.cloudinary.com/daxwfdlwj/image/upload/v1620030640/Food/flag_zltm9h.png"
                className="photo"
              /> สัญชาติ {cate5}</th>
     
   </tr>
 </thead>
 

 <tbody>
 <tr>
  
  <td><button class="btn22 default" value={ cate } onClick={e => setCate("")}> clear</button></td>
  <td><button class="btn22 default" value={ cate2 } onClick={e => setCate2("")}> clear</button></td>
  <td><button class="btn22 default" value={ cate3 } onClick={e => setCate3("")}> clear </button></td>
  <td><button class="btn22 default" value={ cate5 } onClick={e => setCate5("")}> clear</button></td>

</tr>
   <tr>
  
     <td><button class="btn22 default" value={ cate } onClick={e => setCate("หมู")}>หมู    </button></td>
     <td><button class="btn22 default" value={ cate2 } onClick={e => setCate2("เปรี้ยว")}>เปรี้ยว   </button></td>
     <td><button class="btn22 default" value={ cate3 } onClick={e => setCate3("ต้ม")}> ต้ม </button></td>
     <td><button class="btn22 default" value={ cate5 } onClick={e => setCate5("ไทย-กลาง")}> ไทย-กลาง</button></td>
    
   </tr>
   <tr>
   
     <td><button class="btn22 default" value={ cate } onClick={e => setCate("ไก่")}>ไก่</button></td>
     <td><button class="btn22 default" value={ cate2 } onClick={e => setCate2("หวาน")}>หวาน</button></td>
     <td><button class="btn22 default" value={ cate3 } onClick={e => setCate3("ผัด")}>ผัด</button></td>
     <td><button class="btn22 default" value={ cate5 } onClick={e => setCate5("ไทย-เหนือ")}>ไทย-เหนือ</button></td>

   </tr>
   <tr>
 
     <td><button class="btn22 default" value={ cate } onClick={e => setCate("เนื้อวัว")}>เนื้อวัว  </button></td>
     <td><button class="btn22 default" value={ cate2 } onClick={e => setCate2("เค็ม")}>เค็ม</button></td>
     <td><button class="btn22 default" value={ cate3 } onClick={e => setCate3("ตุ๋น")}>ตุ๋น</button></td>
    
     <td><button class="btn22 default" value={ cate4 } onClick={e => setCate5("ไทย-อีสาน")}>ไทย-อีสาน</button></td>

   </tr>
   <tr>

     <td><button class="btn22 default" value={ cate } onClick={e => setCate("ปลา")}>ปลา</button></td>
     <td><button class="btn22 default" value={ cate2 } onClick={e => setCate2("เผ็ด")}>เผ็ด</button></td>
     <td><button class="btn22 default" value={ cate3 } onClick={e => setCate3("ปิ้ง")}>ปิ้ง/ย่าง</button></td>
    
     <td><button class="btn22 default" value={ cate5 } onClick={e => setCate5("ไทย-ใต้")}>ไทย-ใต้</button></td>
  
   </tr>
   <tr>

     <td><button class="btn22 default" value={ cate } onClick={e => setCate("กุ้ง")}>กุ้ง</button></td>
     <td><button class="btn22 default" value={ cate2 } onClick={e => setCate2("จืด")}>จืด</button></td>
     <td><button class="btn22 default" value={ cate3 } onClick={e => setCate3("ทอด")}>ทอด</button></td>
        
     <td><button class="btn22 default" value={ cate5 } onClick={e => setCate5("ต่างประเทศ")}>ต่างประเทศ</button></td>
   
   </tr>
   <tr>

     <td><button class="btn22 default" value={ cate } onClick={e => setCate("หมึก")}>หมึก</button></td>
     <td></td>
     <td><button class="btn22 default" value={ cate3 } onClick={e => setCate3("นึ่ง")}>นึ่ง</button></td>
     
   </tr>
   <tr>

   <td><button  class="btn22 default" value={ cate } onClick={e => setCate("ไข่")}>ไข่</button></td>   
<td></td>
   <td><button  class="btn22 default" value={ cate3 } onClick={e => setCate3("ไมโครเวฟ")}>ไมโครเวฟ</button></td>

   </tr>

 </tbody>
</table>

               </CardBody>
           
             </Card>
           </Col> 
           <Col md="6">
      <Row>
     <Col>
              <Card className="ex4">
                <CardHeader>
                <CardTitle tag="h5" style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
       
        }} >เมนู</CardTitle>
                </CardHeader>
                <CardBody>            
                   <Row>
                { Object.keys(Food).map((id) => {      
            return<Col md="12"> 
                        <div key={id} style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",      
                        }} >     
                  <p><img
                 alt="..."
                 src="https://res.cloudinary.com/daxwfdlwj/image/upload/v1620031916/Food/ingredients_khensj.png"
                 className="photo"
               /> <button class="btn22 default" value={id} onClick={e =>Addlistt(e.target.value)}>{Food[id].name} + </button>
                  </p>   
                              
                    </div>                   
                    </Col> 
        }) }           
      </Row>
                </CardBody>
              </Card>
            </Col>


            <Col>
              <Card style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
       
        }} className="ex4">
                <CardHeader>
                <CardTitle tag="h5">ลิสต์ของคุณ</CardTitle>
                </CardHeader>
                <CardBody >
                { Object.keys(DBFood).map((id) => {
                  return<Row>
                        <p><img
                 alt="..."
                 src="https://res.cloudinary.com/daxwfdlwj/image/upload/v1620032012/Food/pizza_xukibl.png"
                 className="photo"
               /> {DBFood[id].name}<button class="btn22 default" value={id} onClick={e =>Deletelist(e.target.value)}> x </button></p>
                        </Row>
                }) } 
                { Object.keys(MyFood).map((id) => {
                  return<Row>
                        <p><img
                 alt="..."
                 src="https://res.cloudinary.com/daxwfdlwj/image/upload/v1620032012/Food/pizza_xukibl.png"
                 className="photo"
               /> {MyFood[id].name}<button class="btn22 default" value={id} onClick={e =>Deletelist(e.target.value)}> x </button></p>
                        </Row>
                }) } 
                </CardBody>
              </Card>
            </Col>
            </Row>
              <Row>
              <Col>
              <Card className="card-user">
                <CardHeader>
                <CardTitle tag="h5">เพิ่มเมนูอาหาร</CardTitle>
                </CardHeader>
                <CardBody>

        
         <FormGroup>
                          <label>ชื่ออาหาร</label>
                          <Input type="text" value={ name } onChange={e => setname(e.target.value)} />
                        </FormGroup>

        <div style={{
                             
                             display: "flex",
                             justifyContent: "center",
                             
                             alignItems: "center",
                          
                           }} ><button class="btn btn-" onClick={ insertDocument }>เพิ่มเมนู</button></div>

                </CardBody>
              </Card>
            </Col>
              </Row>
            </Col>
       
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
       
        }}className="content"><h2>มื้อนี้กินอะไรดี ?</h2></CardTitle>
                  <Row>
                      <Col md="12">
                      <img
                 alt="..."
                 src={require("assets/img/giphy.gif")}
                 
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
        { Object.keys(Food3).map((id) => {  
          return<CardBody id='RDN'>
                  <Form >
                  <CardTitle style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
       
        }}className="content"><h2>{Food3[id].name}</h2></CardTitle>
                  <Row>
                      <Col md="12">

                      <img alt="..." src={Food3[id].image} style={{ width : '250px', height: '250px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}/>

                    
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
                          value={Food3[id].name} onClick={e =>Addlist(e.target.value, id)}
                          
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
          
  




<div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
       
        }}className="content">
        

           

        </div>
        </div>
       
   
      </>
    );
}

export default Dashboard;