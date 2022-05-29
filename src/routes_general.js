
import menu from "views/menu.jsx";
import random from "views/random.jsx";
import home from "views/home.js";
import Maps from "views/Map.js";
import regis from "views/regis.js";
import login from "views/login.js";
import publication from "views/publication.js";
import people from "views/people.js";
import stat from "views/stat.js";

var routes = [
  {
    name: "homepage",
    icon: "nc-icon nc-bank",
    path: "/home",
    component: home,
    layout: "/general",
  },
  // {
  //   path: "/random",
  //   name: "Research Statistics",
  //   icon: "nc-icon nc-chart-bar-32",
  //   component: random,
  //   layout: "/general",
  // },
  // {
  //   path: "/menu",
  //   name: "Research Explore",
  //   icon: "nc-icon nc-zoom-split",
  //   component: menu,
  //   layout: "/general",
  // },
  {
    path: "/publications",
    name: "publications",
    icon: "nc-icon nc-align-left-2",
    component: publication,
    layout: "/general",
  },
  {
    path: "/people",
    name: "people",
    icon: "nc-icon nc-single-02",
    component: people,
    layout: "/general",
  },
  {
    path: "/stat",
    name: "statistic",
    icon: "nc-icon nc-chart-bar-32",
    component: stat,
    layout: "/general",
  },
  {
    path: "/regis",
    name: "register",
    icon: "nc-icon nc-ruler-pencil",
    component: regis,
    layout: "/general",
  },
  {
    pro: true,
    path: "/login",
    name: "login",
    icon: "nc-icon nc-spaceship",
    component: login,
    layout: "/general",
  }
];

export default routes;
