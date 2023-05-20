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
import React from "react";
import { useLocation, Route, Switch, Redirect } from "react-router-dom";
// reactstrap components
import { Container } from "reactstrap";
// core components
import PrivateNavbar from "components/Navbars/PrivateNavbar.js";
import PrivateFooter from "components/Footers/PrivateFooter.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import AuthContext from "services/auth/AuthContext";

import routes from "routes.js";

const Admin = (props) => {
  const mainContent = React.useRef(null);
  const location = useLocation();

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  //filter admin routes
  const filteredRoutes = routes.filter((route) => route.layout === "/admin");


  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };

  const getBrandText = (path) => {
    const currentRoute = routes.find((route) => {
      if (route.layout + route.path === path) {
        return route.name;
      }
      return undefined;
    })
    return currentRoute.name;
  };

  return (
    <>
      <Sidebar
        {...props}
        routes={filteredRoutes}
        logo={{
          innerLink: "/",
          imgSrc: require("../assets/img/brand/f1-manager.png"),
          imgAlt: "..."
        }}
      />
      <div className="main-content d-flex flex-column min-vh-100" ref={mainContent}>
        <PrivateNavbar
          {...props}
          brandText={getBrandText(props.location.pathname)}
        />
        <Switch>
          {getRoutes(routes)}
          <Redirect from="*" to="/" />
        </Switch>
        <Container className="mt-auto" fluid>
          <PrivateFooter />
        </Container>
      </div>
    </>
  );
};

export default Admin;
