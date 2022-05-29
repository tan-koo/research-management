// เรียกใช้ module
import React, { useState, useEffect } from 'react'
// เรียกใช้ module
import firebaseApp from '../firebase.js'

/* โค้ดการเรียกใช้ firebaseApp */

import { Col, Card, Row} from "react-bootstrap";

function Display() {
    
    // ประกาศตัวแปร state
    const [ Food, setFood ] = useState({})

    // ประกาศตัวแปรเพื่ออ้างอิง user collection
    const db = firebaseApp.firestore()
    const userCollection = db.collection('Food2')   


    useEffect(() => {
        // subscription นี้จะเกิด callback กับทุกการเปลี่ยนแปลงของ collection Food
        const unsubscribe = userCollection.onSnapshot(ss => {
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
    }, [])

        /* โค้ด realtime subscription */

        async function deleteDocument(id) {
            // ประกาศตัวแปรเพื่ออ้างอิงไปยัง document ที่จะทำการลบ
            const documentRef = userCollection.doc(id)
            // ลบ document
            await documentRef.delete()
    
            alert(`document ${ id } has been deleted`)
        }
    


    return( <div className="content">
          <Row>
        { Object.keys(Food).map((id) => {
            
            return<Col md="3"> 
                        <div key={id}>
                        <Card>
                        <Card.Img variant="top" src={Food[id].image} style={{ height: '250px' }}/>
                        <Card.Body>
                            <Card.Title>{Food[id].name}</Card.Title>
                            <Card.Text>
                            ...
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer>  
                        {Food[id].cate +" "}
                        <button onClick={ () => deleteDocument(id) }>Delete</button>
                        </Card.Footer>
                        </Card>
                        
                    </div>
                    </Col> 
        }) }   
        </Row> 
            </div>            
    )
}
export default Display;
