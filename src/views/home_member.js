
import React, { useState, useEffect, useContext } from 'react';
import firebaseApp from '../firebase.js';
import { Redirect } from 'react-router-dom'
import { AuthContext } from "components/Auth/Auth.js";
// react plugin used to create charts
import { Line, Pie } from "react-chartjs-2";
// reactstrap components
import {
  Card, CardHeader, CardBody, CardFooter, CardTitle,
  Row, Col
} from "reactstrap";
// core components
import {
  dashboard24HoursPerformanceChart, dashboardEmailStatisticsChart, dashboardNASDAQChart
} from "variables/charts.js";


function Home() {

  const { currentUser } = useContext(AuthContext);

  if (!currentUser) { return <Redirect to="/general/login" />; }

  return (
    <div>
      <div className="content">
        <Row style={{ display: "flex", justifyContent: "center", alignItems: "center" }} >
          <Col md="10">
            <img alt="..."
              src="https://sv1.picz.in.th/images/2022/05/13/HcZ1Xa.gif" />
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Home;
