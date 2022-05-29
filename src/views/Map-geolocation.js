import React, { useState, useEffect, useContext } from 'react';
import firebaseApp from '../firebase.js';
import LDMap from 'components/LongdoMap/LDMap.js'
import { Redirect } from 'react-router-dom'
import { AuthContext } from "components/Auth/Auth.js";
// react plugin used to create charts
import { Line, Pie } from "react-chartjs-2";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
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

    if ("geolocation" in navigator) {
        return <Redirect to="/general/maps" />;
    }

    if (currentUser) {
        return <Redirect to="/member/home" />;
    }

    return (
      
      <>
        <h1>กดยืนยันตำแหน่งก่อนใช้งาน</h1>
        <div style={{ height: '90%'}}>  
          <LDMap/> 
        </div>
      </>
    );
}

export default Map;
