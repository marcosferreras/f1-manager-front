import React from "react";
import { useLocation, Route, Switch, Redirect } from "react-router-dom";
// reactstrap components
import { Container, Row, Col } from "reactstrap";

// core components
import PublicNavbar from "components/Navbars/PublicNavbar.js";
import AuthFooter from "components/Footers/AuthFooter.js";

import routes from "routes.js";

const Public = (props) => {
  const mainContent = React.useRef(null);
  const location = useLocation();

  React.useEffect(() => {
    document.body.classList.add("bg-dark");
    return () => {
      document.body.classList.remove("bg-dark");
    };
  }, []);
  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "") {
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

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="main-content" ref={mainContent}>
        <PublicNavbar />
        <div className="py-7 py-md-8">
          <Container>
            <div className="header-body text-center mb-7">
            </div>
          </Container>

        </div>
        {/* Page content */}
        <Container className="mt--8 pb-6 w-75" fluid>
          <Row className="justify-content-center">
            <Switch>
              {getRoutes(routes)}
              <Redirect from="*" to="/404" />
            </Switch>
          </Row>
        </Container>
      </div>
      <AuthFooter />
    </div>
  );
};

export default Public;
