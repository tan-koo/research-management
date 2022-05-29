
import React, { useState, useEffect, useContext } from 'react';
import firebaseApp from '../firebase.js';
import { Redirect, useHistory } from 'react-router-dom'
// react plugin used to create charts
import { Line, Pie, Bar } from "react-chartjs-2";
// reactstrap components
import {
  Card, CardHeader, CardBody, CardFooter, CardTitle,
  Row, Col, Button, Table, Input, Label
} from "reactstrap";
// core components
import Popup from "views/Popup.js";
import { object } from 'firebase-functions/lib/providers/storage';

function Dashboard() {
  const [User, setUser] = useState(0)
  const [User1, setUser1] = useState({})
  const [User2, setUser2] = useState({})
  const [User3, setUser3] = useState({})
  const [User4, setUser4] = useState({})
  const [User5, setUser5] = useState({})
  const [User6, setUser6] = useState({})
  const [User7, setUser7] = useState({})
  const [User8, setUser8] = useState({})
  const [User9, setUser9] = useState({})
  const [User10, setUser10] = useState({})
  const [User11, setUser11] = useState({})
  const [User12, setUser12] = useState({})
  const [FoodCount, setFoodCount] = useState(0)

  const [Research, setResearch] = useState({})
  const [ResearchCount, setResearchCount] = useState(0)
  const [ResearchQ, setResearchQ] = useState([])
  const [ResearchQCount, setResearchQCount] = useState(0)
  const [YearFilter, setYearFilter] = useState([])

  const [c, setC] = useState(0)
  const [quartile, setQuartile] = useState([])
  const [quartileText, setQuartileText] = useState(['Q1', 'Q2', 'Q3', 'Q4', 'others'])
  const [checkState, setCheckState] = useState(false)
  const [yearBoolean, setYearBoolean] = useState([])
  const [qBoolean, setQBoolean] = useState([])
  const [label, setLabel] = useState([])
  const [datasets, setDatasets] = useState([])
  const [defaultChrat, setDefaultChart] = useState({})

  const [dashboardResearchChart, setDashboardResearchChart] = useState({
    type: "bar",
    data: {
      labels: [2019, 2020, 2021, 2022],
      datasets: [
        {
          label: "Q1",
          stack: '1',
          order: 1,
          backgroundColor: "rgb(244, 241, 222)",
          borderColor: "rgb(255, 99, 132)",
          data: [1, 2, 1, 3],
        },
        {
          label: "Q2",
          stack: '2',
          order: 2,
          backgroundColor: "rgb(224, 122, 95)",
          borderColor: "rgb(75, 192, 192)",
          data: [2, 1, 3, 1],
        },
        {
          label: "Q3",
          stack: '3',
          order: 2,
          backgroundColor: "rgb(61, 64, 91)",
          borderColor: "rgb(75, 192, 192)",
          data: [2, 1, 2, 1],
        },
        {
          label: "Q4",
          stack: '4',
          order: 2,
          backgroundColor: "rgb(129, 178, 154)",
          borderColor: "rgb(75, 192, 192)",
          data: [1, 3, 3, 2],
        },
        {
          label: "others",
          stack: '5',
          order: 2,
          backgroundColor: "rgb(242, 204, 143)",
          borderColor: "rgb(75, 192, 192)",
          data: [1, 3, 3, 2],
        }
      ]
    },
    options: {
      datasets: {
        bar: {
          barPercentage: 0.7,
          categoryPercentage: 0.8,
        }
      },
      scales: {
        xAxes: [{ stacked: false }],
        yAxes: [{
          stacked: true,
          id: "y",
          display: 'auto',
          ticks: {
            min: 0,
            stepSize: 1,
            max: 5
          },
        }]
      }
    }
  })

  const [RestaurantName, setRestaurantName] = useState([])
  const [RestaurantCount, setRestaurantCount] = useState(0)
  const [Restaurant, setRestaurant] = useState({})
  const [ResearchName, setResearchName] = useState([])
  const [Food, setFood] = useState({})
  const history = useHistory()
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => { setIsOpen(!isOpen); }

  const dashboardNASDAQChart = {
    data: (canvas) => {
      return {
        labels: ["2018", "2019", "2020", "2021", "2022"],
        datasets: [
          {
            data: [User1, User2, User3, User4, User5,
              User6, User7, User8, User9, User10,
              User11, User12],
            fill: false,
            borderColor: "#51CACF",
            backgroundColor: "transparent",
            pointBorderColor: "#51CACF",
            pointRadius: 4,
            pointHoverRadius: 4,
            pointBorderWidth: 8,
          },
        ],
      };
    },
    options: {
      legend: {
        display: false,
        position: "top",
      },
    },
  };

  var today = new Date()
  const now = today.getFullYear() + '-' + ("0" + (today.getMonth() + 1)).slice(-2) + '-' + ("0" + today.getDate()).slice(-2);
  const currentyear = today.getFullYear();

  function decrementDate(date_str, decrementor) {
    var parts = date_str.split("-");
    var dt = new Date(
      parseInt(parts[0], 10),      // year
      parseInt(parts[1], 10) - 1,  // month (starts with 0)
      parseInt(parts[2], 10)       // date
    );
    dt.setTime(dt.getTime() - decrementor * 86400000);

    parts[0] = "" + dt.getFullYear();
    parts[1] = "" + (dt.getMonth() + 1);

    if (parts[1].length < 2) { parts[1] = "0" + parts[1]; }

    parts[2] = "" + dt.getDate();

    if (parts[2].length < 2) { parts[2] = "0" + parts[2]; }

    return parts.join("-");
  };

  useEffect(() => {
    const db = firebaseApp.firestore()
    const FoodCollection = db.collection('Food2').orderBy('Interesting').limitToLast(3)
    // subscription นี้จะเกิด callback กับทุกการเปลี่ยนแปลงของ collection Food
    const unsubscribe = FoodCollection.onSnapshot(ss => {
      // ตัวแปร local
      const Food = []

      ss.forEach(document => {
        // manipulate ตัวแปร local
        Food.push(document.data())
      })

      // เปลี่ยนค่าตัวแปร state

      setFood(Food.sort((a, b) => (a.Interesting > b.Interesting) ? -1 : 1))
    })

    return () => {
      // ยกเลิก subsciption เมื่อ component ถูกถอดจาก dom
      unsubscribe()
    }
  }, [])//เมื่อค่า cate เปลี่ยนจะทำการอัพเดท useEffect ใหม่ #ไอห่า หาเป็นวันกว่าจะได้ 

  useEffect(() => {
    const db = firebaseApp.firestore()
    const ResearchCollection = db.collection('research')
    // subscription นี้จะเกิด callback กับทุกการเปลี่ยนแปลงของ collection Food
    const unsubscribe = ResearchCollection.onSnapshot(ss => {
      // ตัวแปร local
      const Research = []

      let max, min
      let q1 = []
      let q2 = []
      let q3 = []
      let q4 = []
      let others = []
      let dashboard = dashboardResearchChart

      ss.forEach(document => {
        // manipulate ตัวแปร local
        Research.push(document.data())
      })

      // เปลี่ยนค่าตัวแปร state
      setResearch(Research)
      setResearchCount(Research.length)

      for (let i = 0; i < Research.length; i++) {
        if (i == 0) {
          max = Research[i].year
          min = Research[i].year
        }
        if (Research[i].year > max) { max = Research[i].year }
        if (Research[i].year < min) { min = Research[i].year }
      }

      for (let a = min; a <= max; a++) {
        q1[a - min] = 0
        q2[a - min] = 0
        q3[a - min] = 0
        q4[a - min] = 0
        others[a - min] = 0
      }

      for (let i = 0; i < Research.length; i++) {
        for (let j = min; j <= max; j++) {
          if (Research[i].year == j) {
            if (Research[i].quartile == 'Q1') { q1[j - min]++ }
            if (Research[i].quartile == 'Q2') { q2[j - min]++ }
            if (Research[i].quartile == 'Q3') { q3[j - min]++ }
            if (Research[i].quartile == 'Q4') { q4[j - min]++ }
            if (Research[i].quartile == 'others') { others[j - min]++ }
          }
        }
      }

      dashboard.data.datasets[0].data = q1
      dashboard.data.datasets[1].data = q2
      dashboard.data.datasets[2].data = q3
      dashboard.data.datasets[3].data = q4
      dashboard.data.datasets[4].data = others

      let defaultLabel = []
      let defaultDatasets = dashboard.data.datasets
      let labelBoolean = []
      let defaultQBoolean = [true, true, true, true, true]


      for (let i = min; i <= max; i++) {
        defaultLabel.push(i)
        labelBoolean.push(true)
      }

      dashboard.data.labels = defaultLabel

      if (c == 0) {
        setDashboardResearchChart(dashboard)
        setLabel(defaultLabel)
        setYearBoolean(labelBoolean)
        setQBoolean(defaultQBoolean)
        setDatasets(defaultDatasets)
        setCheckState(true)
      }
      setDefaultChart(dashboard)
    })

    return () => {
      // ยกเลิก subsciption เมื่อ component ถูกถอดจาก dom
      unsubscribe()
    }
  }, [c])//เมื่อค่า cate เปลี่ยนจะทำการอัพเดท useEffect ใหม่ #ไอห่า หาเป็นวันกว่าจะได้ 


  useEffect(() => {
    const db = firebaseApp.firestore()
    const FoodCollection = db.collection('Restaurant').orderBy('Interesting').limitToLast(3)
    // subscription นี้จะเกิด callback กับทุกการเปลี่ยนแปลงของ collection Food
    const unsubscribe = FoodCollection.onSnapshot(ss => {
      // ตัวแปร local
      const Restaurant = []

      ss.forEach(document => {
        // manipulate ตัวแปร local
        Restaurant.push(document.data())
      })

      // เปลี่ยนค่าตัวแปร state
      setRestaurant(Restaurant.sort((a, b) => (a.Interesting > b.Interesting) ? -1 : 1))
    })

    return () => {
      // ยกเลิก subsciption เมื่อ component ถูกถอดจาก dom
      unsubscribe()
    }
  }, [])//เมื่อค่า cate เปลี่ยนจะทำการอัพเดท useEffect ใหม่ #ไอห่า หาเป็นวันกว่าจะได้ 

  useEffect(() => {
    //ใช้ firebaseApp.auth().onAuthStateChanged เพื่อใช้ firebaseApp.auth().currentUser โดยไม่ติด error เมื่อทำการ signout
    firebaseApp.auth().onAuthStateChanged(user => {
      const db = firebaseApp.firestore()
      const UserCollection = db.collection('User').where('Register_Date', '<=', now)
      const UserCollection1 = db.collection('User').where('Register_Year_Mounth', '<=', `${currentyear}-01`)
      const UserCollection2 = db.collection('User').where('Register_Year_Mounth', '<=', `${currentyear}-02`)
      const UserCollection3 = db.collection('User').where('Register_Year_Mounth', '<=', `${currentyear}-03`)
      const UserCollection4 = db.collection('User').where('Register_Year_Mounth', '<=', `${currentyear}-04`)
      const UserCollection5 = db.collection('User').where('Register_Year_Mounth', '<=', `${currentyear}-05`)
      const UserCollection6 = db.collection('User').where('Register_Year_Mounth', '<=', `${currentyear}-06`)
      const UserCollection7 = db.collection('User').where('Register_Year_Mounth', '<=', `${currentyear}-07`)
      const UserCollection8 = db.collection('User').where('Register_Year_Mounth', '<=', `${currentyear}-08`)
      const UserCollection9 = db.collection('User').where('Register_Year_Mounth', '<=', `${currentyear}-09`)
      const UserCollection10 = db.collection('User').where('Register_Year_Mounth', '<=', `${currentyear}-10`)
      const UserCollection11 = db.collection('User').where('Register_Year_Mounth', '<=', `${currentyear}-11`)
      const UserCollection12 = db.collection('User').where('Register_Year_Mounth', '<=', `${currentyear}-12`)
      const ReseachCollection = db.collection('reseach')
      const FoodCollection = db.collection('Food2')
      const RestaurantCollection = db.collection('Restaurant')

      // subscription นี้จะเกิด callback กับทุกการเปลี่ยนแปลงของ collection Food
      const unsubscribe = UserCollection.onSnapshot(ss => {
        // ตัวแปร local
        var count = 0

        ss.forEach(document => {
          // manipulate ตัวแปร local
          count++
        })
        setUser(count)
      })

      // subscription นี้จะเกิด callback กับทุกการเปลี่ยนแปลงของ collection Food
      const unsubscribe1 = UserCollection1.onSnapshot(ss => {
        // ตัวแปร local
        var count = 0

        ss.forEach(document => {
          // manipulate ตัวแปร local
          count++
        })
        setUser1(count)
      })

      const unsubscribe2 = UserCollection2.onSnapshot(ss => {
        // ตัวแปร local
        var count = 0

        ss.forEach(document => {
          // manipulate ตัวแปร local
          count++
        })
        setUser2(count)
      })

      const unsubscribe3 = UserCollection3.onSnapshot(ss => {
        // ตัวแปร local
        var count = 0

        ss.forEach(document => {
          // manipulate ตัวแปร local
          count++
        })
        setUser3(count)
      })

      const unsubscribe4 = UserCollection4.onSnapshot(ss => {
        // ตัวแปร local
        var count = 0

        ss.forEach(document => {
          // manipulate ตัวแปร local
          count++
        })
        setUser4(count)
      })

      const unsubscribe5 = UserCollection5.onSnapshot(ss => {
        // ตัวแปร local
        var count = 0

        ss.forEach(document => {
          // manipulate ตัวแปร local
          count++
        })
        setUser5(count)
      })

      const unsubscribe6 = UserCollection6.onSnapshot(ss => {
        // ตัวแปร local
        var count = 0

        ss.forEach(document => {
          // manipulate ตัวแปร local
          count++
        })
        setUser6(count)
      })

      const unsubscribe7 = UserCollection7.onSnapshot(ss => {
        // ตัวแปร local
        var count = 0

        ss.forEach(document => {
          // manipulate ตัวแปร local
          count++
        })
        setUser7(count)
      })

      const unsubscribe8 = UserCollection8.onSnapshot(ss => {
        // ตัวแปร local
        var count = 0

        ss.forEach(document => {
          // manipulate ตัวแปร local
          count++
        })
        setUser8(count)
      })

      const unsubscribe9 = UserCollection9.onSnapshot(ss => {
        // ตัวแปร local
        var count = 0

        ss.forEach(document => {
          // manipulate ตัวแปร local
          count++
        })
        setUser9(count)
      })

      const unsubscribe10 = UserCollection10.onSnapshot(ss => {
        // ตัวแปร local
        var count = 0

        ss.forEach(document => {
          // manipulate ตัวแปร local
          count++
        })
        setUser10(count)
      })

      const unsubscribe11 = UserCollection11.onSnapshot(ss => {
        // ตัวแปร local
        var count = 0

        ss.forEach(document => {
          // manipulate ตัวแปร local
          count++
        })
        setUser11(count)
      })

      const unsubscribe12 = UserCollection12.onSnapshot(ss => {
        // ตัวแปร local
        var count = 0

        ss.forEach(document => {
          // manipulate ตัวแปร local
          count++
        })
        setUser12(count)
      })

      const unsubscribeFood = FoodCollection.onSnapshot(ss => {
        // ตัวแปร local
        var count = 0

        ss.forEach(document => {
          // manipulate ตัวแปร local
          count++
        })
        setFoodCount(count)
      })

      // const unsubscribeReseach = ReseachCollection.onSnapshot(ss => {
      //   // ตัวแปร local
      //   var count = 0

      //   ss.forEach(document => {
      //     // manipulate ตัวแปร local
      //     count++
      //   })
      //   setResearchCount(count)
      // })

      // const unsubscribeReseach = ReseachCollection.onSnapshot(ss => {
      //   // ตัวแปร local
      //   var count = 0
      //   const Reseach = {}
      //   const reseachName = []

      //   ss.forEach(document => {
      //     // manipulate ตัวแปร local
      //     Reseach[document.id] = document.data()
      //     reseachName.push(Reseach[document.id].name)
      //     count++
      // })
      //   setResearchName(reseachName)
      //   setResearchCount(count)
      // })

      const unsubscribeRestaurant = RestaurantCollection.onSnapshot(ss => {
        // ตัวแปร local
        var count = 0
        const Restaurant = {}
        const RestaurantName = []

        ss.forEach(document => {
          // manipulate ตัวแปร local
          Restaurant[document.id] = document.data()
          RestaurantName.push(Restaurant[document.id].name)
          count++
        })
        setRestaurantName(RestaurantName)
        setRestaurantCount(count)
      })
    });
  }, [])

  const gtmember = () => { history.push("/admin/member"); }
  const gtmenu = () => { history.push("/admin/menu"); }

  const goToPeople = () => { window.location.href = "/general/people"; }
  const goToPublication = () => { window.location.href = "/general/publications"; }

  const yearCheck = (e, id) => {
    let dashboard = dashboardResearchChart
    let year = yearBoolean
    let count = c
    let test = []
    let newLabel = []

    count++
    setC(count)

    for (let i = 0; i < year.length; i++) {
      if (i == id) { test.push(e) }
      if (i != id) { test.push(year[i]) }
    }

    for (let i = 0; i < test.length; i++) {
      if (test[i] == true) { newLabel.push(label[i]) }
    }

    for (let i = 0; i < dashboard.data.datasets.length; i++) {
      let test1 = []
      for (let j = 0; j < dashboard.data.datasets[i].data.length; j++) {
        if (test[j] == true) { test1.push(dashboard.data.datasets[i].data[j]) }

      }
      dashboard.data.datasets[i].data = test1
    }

    dashboard.data.labels = newLabel

    setDashboardResearchChart(dashboard)
    setYearBoolean(test)
  }

  const quartileCheck = (e, id) => {
    let dashboard = dashboardResearchChart
    let qBool = qBoolean
    let newQBool = []
    let newDatasets = []

    for (let i = 0; i < qBool.length; i++) {
      if (i != id) { newQBool.push(qBool[i]) }
      if (i == id) { newQBool.push(e) }
    }

    for (let i = 0; i < newQBool.length; i++) {
      if (newQBool[i] == true) { newDatasets.push(datasets[i]) }
    }

    dashboard.data.datasets = newDatasets

    setQBoolean(newQBool)
    setDashboardResearchChart(dashboard)
  }

  return (
    <div className="content mx-1 pt-0">
      <Row style={{ display: "flex", justifyContent: "center" }}>
        <Col lg="4" md="6" sm="6">
          <Card className="card-stats">
            <CardBody>
              <Row>
                <Col md="4" xs="5">
                  <div className="icon-big text-center icon-warning">
                    <i className="nc-icon nc-badge text-warning" />
                  </div>
                </Col>
                <Col md="8" xs="7">
                  <div className="numbers">
                    <p className="card-category">Member number</p>
                    <CardTitle tag="p">{User}</CardTitle>
                    <p />
                  </div>
                </Col>
              </Row>
            </CardBody>
            <CardFooter>
              <hr></hr>
              <div className="stats">
                <button class="btn22 default" className='btn btn-outline-warning btn-sm' onClick={() => goToPeople()}>
                  <i className="fa fa-list" />see member</button>
              </div>
            </CardFooter>
          </Card>
        </Col>

        <Col lg="4" md="6" sm="6">
          <Card className="card-stats">
            <CardBody>
              <Row>
                <Col md="4" xs="5">
                  <div className="icon-big text-center icon-warning">
                    <i className="nc-icon nc-world-2 text-danger" />
                  </div>
                </Col>
                <Col md="8" xs="7">
                  <div className="numbers">
                    <p className="card-category">Publication number</p>
                    <CardTitle tag="p">{ResearchCount}</CardTitle>
                    <p />
                  </div>
                </Col>
              </Row>
            </CardBody>
            <CardFooter>
              <hr></hr>
              <div className="stats">
                <button class="btn22 default" className='btn btn-outline-danger btn-sm' onClick={() => goToPublication()}>
                  <i className="fa fa-list" />see publication</button>
              </div>
            </CardFooter>
          </Card>
        </Col>
      </Row>

      {/* <Row>
        <Col md="12">
          <Card className="card-chart">
            <CardHeader>
              <CardTitle tag="h5">ระบบสมาชิก</CardTitle>
            </CardHeader>
            <CardBody >
              <Line data={dashboardNASDAQChart.data} options={dashboardNASDAQChart.options}
                width={400} height={100} />
            </CardBody>
            <CardFooter>
              <div className="chart-legend">
                <i className="fa fa-circle text-primary" /> จำนวนสมาชิกในระบบ{" "}
              </div>
              <hr />
              <div className="card-stats">
                <i className="fa fa-check" /> ปัจจุบันมีสมาชิก : {User}
              </div>
            </CardFooter>
          </Card>
        </Col>
      </Row> */}

      <Row>
        <Col md="12">
          <Card className="card-chart">
            <CardHeader>
              <CardTitle tag="h5" className="font">Publications</CardTitle>
            </CardHeader>
            <CardBody className='mx-5 mt-3'>
              <Bar className="font" data={dashboardResearchChart.data} options={dashboardResearchChart.options}
                width={400} height={150} />
            </CardBody>
            <CardFooter>
              <div className="chart-legend">
                <Row style={{ display: "flex", justifyContent: "center" }}>
                  <Col md='8'>
                    <Table className="font">
                      <tbody>
                        <tr>
                          <td>Year</td>
                          {Object.keys(label).map((id) => {
                            return (
                              <td>
                                <Input type="checkbox" onClick={(e) => yearCheck(e.target.checked, id)}
                                  defaultChecked={yearBoolean[id]} />{label[id]}
                              </td>);
                          })}
                        </tr>
                        <tr>
                          <td>Quartile</td>
                          {Object.keys(quartileText).map((id) => {
                            return (
                              <td>
                                <Input type="checkbox" onClick={(e) => quartileCheck(e.target.checked, id)}
                                  defaultChecked={qBoolean[id]} />{quartileText[id]}
                              </td>);
                          })}
                          {/* <td><Button outline color="warning" size="sm">Q1</Button></td>
                          <td><Button outline color="warning" size="sm">Q2</Button></td>
                          <td><Button outline color="warning" size="sm">Q3</Button></td>
                          <td><Button outline color="warning" size="sm">Q4</Button></td>
                          <td><Button outline color="warning" size="sm">others</Button></td> */}
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </div>
              {/* <hr></hr>
              <div className="card-stats">
                <i className="fa fa-check" /> Publication number : {ResearchCount}
              </div> */}
            </CardFooter>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
