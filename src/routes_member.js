
import menu from "views/menu_member.jsx";
import explore from "views/explore.js";
import list from "views/list_member.js";
import random from "views/random_member.js";
import insert from "views/insertmenu.jsx";
import home from "views/home_member.js";
import manage from "views/publication_member";
import stat from "views/stat_member.js";
import Maps from "views/Map_member.js";
import profile from "views/profile_member.js";
import Seemore from "views/seemore_member.js";

var routes = [
  // {
  //   path: "/home",
  //   name: "Home",
  //   icon: "nc-icon nc-bank",
  //   component: home,
  //   layout: "/member",
  // },
  // {
  //   path: "/explore",
  //   name: "Research Explore",
  //   icon: "nc-icon nc-zoom-split",
  //   component: explore,
  //   layout: "/member",
  // },
  {
    path: "/manage",
    name: "publications",
    icon: "nc-icon nc-bullet-list-67",
    component: manage,
    layout: "/member",
  },
  {
    path: "/insert",
    name: "new paper",
    icon: "nc-icon nc-paper",
    component: insert,
    layout: "/member",
  },
  {
    path: "/stat",
    name: "statistic",
    icon: "nc-icon nc-chart-bar-32",
    component: stat,
    layout: "/member",
  },
  {
    pro: true,
    path: "/profile",
    name: "profile",
    icon: "nc-icon nc-circle-10",
    component: profile,
    layout: "/member",
  }
  // {
  //   path: "/seemore",
  //   component: Seemore,
  //   layout: "/member",
  // },
];

export default routes;
