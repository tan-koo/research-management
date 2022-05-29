
// เรียกใช้ module
import firebase from '@firebase/app'
import '@firebase/firestore'
import '@firebase/auth'

// ค่า minimum configuration คือ `apiKey` และ `projectId`
const config = firebase.initializeApp({
    apiKey: "AIzaSyAWG-rh07c5yKtkqJrlp0d0avDgOAV6ADA",
    authDomain: "research-database-662bb.firebaseapp.com",
    databaseURL: "https://research-database-662bb-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "research-database-662bb",
    storageBucket: "research-database-662bb.appspot.com",
    messagingSenderId: "571898745816",
    appId: "1:571898745816:web:5607cd74b1bd3cb7a418ad",
    measurementId: "G-MPVZZ6JGXJ"
})

export default firebase.apps[0] || firebase.initializeApp(config)