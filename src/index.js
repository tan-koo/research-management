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

import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.css";
import "assets/scss/paper-dashboard.scss?v=1.2.0";
import "assets/demo/demo.css";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import { AuthProvider } from "components/Auth/Auth.js";

import geolocation from "views/Map-geolocation.js";

import GeneralLayout from "layouts/General.js";
import MemberLayout from "layouts/Member.js";
import AdminLayout from "layouts/Admin.js";

const hist = createBrowserHistory();

ReactDOM.render(
  <AuthProvider>
    <Router history={hist}>
      <Switch>
        <Route path="/general/random/food" component={geolocation} />
        <Route path="/general" render={(props) => <GeneralLayout {...props} />} />
        <Route path="/member" render={(props) => <MemberLayout {...props} />} />
        <Route path="/admin" render={(props) => <AdminLayout {...props} />} />
        <Redirect to="/general/home" />
      </Switch>
    </Router>
  </AuthProvider>,
  document.getElementById("root")
);
