/*!

=========================================================
* Argon Dashboard React - v1.2.2
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import UsersManagement from "views/private/Admin/UsersManagement";
import Profile from "views/private/Common/Profile.js";
import NewsManagement from "views/private/Admin/NewsManagement";
import Register from "views/public/Register.js";
import Login from "views/public/Login.js";
import VotesManagement from "views/private/Admin/VotesManagement";
import TeamsInformation from "views/private/Admin/TeamsInformation";
import CircuitsManagement from "views/private/Admin/CircuitsManagement";
import PublicIndex from "views/public/Index";
import News from "views/public/News";
import Teams from "views/public/Teams";
import Calendar from "views/public/Calendar";
import Simulations from "views/private/Common/Simulations";
import CarsManagement from "views/private/Teams/CarsManagement";
import TeamsManagement from "views/private/Teams/TeamsManagement";
import PilotsManagement from "views/private/Teams/PilotsManagement";
import TeamLeadersManagement from "views/private/Teams/TeamLeadersManagement";
import { faCalendar, faChalkboardTeacher, faChartLine, faIdBadge, faNewspaper, faPeopleRoof, faPoll, faRoad, faUsers } from "@fortawesome/free-solid-svg-icons";
import F1CarIcon from "components/Icons/F1CarIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import F1DriverIcon from "components/Icons/F1DriverIcon";
import CalendarManagement from "views/private/Admin/CalendarManagement";

var routes = [
  {
    path: "/news",
    name: "News",
    icon: faNewspaper,
    component: News,
    layout: ""
  },
  {
    path: "/teams-info",
    name: "Teams",
    icon: "ni ni-tv-2 text-primary",
    component: Teams,
    layout: ""
  },
  {
    path: "/calendar",
    name: "Calendar",
    icon: "ni ni-tv-2 text-primary",
    component: Calendar,
    layout: ""
  },
  {
    path: "/",
    name: "Home",
    icon: "ni ni-tv-2 text-primary",
    component: PublicIndex,
    layout: ""
  },
  {
    path: "/calendar",
    name: "Calendar",
    icon: <FontAwesomeIcon icon={faCalendar} style={{ width: '20px' }} />,
    component: CalendarManagement,
    layout: "/admin"
  },
  {
    path: "/circuits-management",
    name: "Circuits",
    icon: <FontAwesomeIcon icon={faRoad} style={{ width: '20px' }} />,
    component: CircuitsManagement,
    layout: "/admin"
  },
  {
    path: "/surveys-management",
    name: "Surveys",
    icon: <FontAwesomeIcon icon={faPoll} style={{ width: '20px' }} />,
    component: VotesManagement,
    layout: "/admin"
  },
  {
    path: "/news-management",
    name: "News",
    icon: <FontAwesomeIcon icon={faNewspaper} style={{ width: '20px' }} />,
    component: NewsManagement,
    layout: "/admin"
  },
  {
    path: "/users-management",
    name: "Users",
    icon: <FontAwesomeIcon icon={faUsers} style={{ width: '20px' }} />,
    component: UsersManagement,
    layout: "/admin"
  },
  {
    path: "/simulations",
    name: "Simulations",
    icon: <FontAwesomeIcon icon={faChartLine} style={{ width: '20px' }} />,
    component: Simulations,
    layout: "/admin"
  },
  {
    path: "/teams-info",
    name: "Teams Information",
    icon: <FontAwesomeIcon icon={faPeopleRoof} style={{ width: '20px' }} />,
    component: TeamsInformation,
    layout: "/admin"
  },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: <FontAwesomeIcon icon={faIdBadge} style={{ width: '20px' }} />,
    component: Profile,
    layout: "/admin"
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: Login,
    layout: "/auth"
  },
  {
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: Register,
    layout: "/auth"
  },
  {
    path: "/cars-management",
    name: "Cars ",
    icon: <F1CarIcon sx={{fontSize:'30px'}}/>,
    component: CarsManagement,
    layout: "/teams"
  },
  {
    path: "/pilots-management",
    name: "Pilots",
    icon: <F1DriverIcon sx={{fontSize:'20px'}}/>,
    component: PilotsManagement,
    layout: "/teams"
  },
  {
    path: "/teams-management",
    name: "Team",
    icon: <FontAwesomeIcon icon={faPeopleRoof} style={{ width: '20px' }} />,
    component: TeamsManagement,
    layout: "/teams"
  },
  {
    path: "/team-leader-management",
    name: "Team Leaders",
    icon: <FontAwesomeIcon icon={faChalkboardTeacher} style={{ width: '20px' }} />,
    component: TeamLeadersManagement,
    layout: "/teams"
  },
  {
    path: "/simulations",
    name: "Simulations",
    icon: <FontAwesomeIcon icon={faChartLine} style={{ width: '20px' }} />,
    component: Simulations,
    layout: "/teams"
  },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: <FontAwesomeIcon icon={faIdBadge} style={{ width: '20px' }} />,
    component: Profile,
    layout: "/teams"
  },
];
export default routes;
