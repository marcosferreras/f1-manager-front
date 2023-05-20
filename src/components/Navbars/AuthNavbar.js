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
import { Link } from "react-router-dom";
// reactstrap components
import {
  UncontrolledCollapse,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col
} from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNewspaper, faHouse, faFlagCheckered, faRightToBracket, faCalendar } from '@fortawesome/free-solid-svg-icons';

const AuthNavbar = () => {
  return (
    <>
      <Navbar className="navbar-top navbar-horizontal navbar-dark bg-primary" expand="md">
        <Container className="px-5" fluid>
          <NavbarBrand to="/" tag={Link}>
            <img
              alt="..."
              src={require("../../assets/img/brand/f1-manager.png")}
            />
          </NavbarBrand>
          <button className="navbar-toggler" id="navbar-collapse-main">
            <span className="navbar-toggler-icon" />
          </button>
          <UncontrolledCollapse navbar toggler="#navbar-collapse-main">
            <div className="navbar-collapse-header d-md-none">
              <Row>
                <Col className="collapse-brand" xs="6" >
                  <Link to="/">
                    <img
                      alt="..."
                      src={require("../../assets/img/brand/f1-manager.png")}
                      className="p-2 bg-primary"
                      style={{ borderRadius: "6px" }}
                    />
                  </Link>
                </Col>
                <Col className="collapse-close" xs="6">
                  <button className="navbar-toggler" id="navbar-collapse-main">
                    <span />
                    <span />
                  </button>
                </Col>
              </Row>
            </div>
            <Nav navbar>
              <NavItem>
                <NavLink className="nav-link-icon" to="/" tag={Link}>
                  <FontAwesomeIcon icon={faHouse} />
                  <span className="nav-link-inner--text"> Home</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className="nav-link-icon"
                  to="/news"
                  tag={Link}
                >
                  <FontAwesomeIcon icon={faNewspaper} />
                  <span className="nav-link-inner--text"> News</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className="nav-link-icon"
                  to="/teams-info"
                  tag={Link}
                >
                  <FontAwesomeIcon icon={faFlagCheckered} />
                  <span className="nav-link-inner--text"> Teams</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className="nav-link-icon"
                  to="/calendar"
                  tag={Link}
                >
                  <FontAwesomeIcon icon={faCalendar} />
                  <span className="nav-link-inner--text"> Calendar</span>
                </NavLink>
              </NavItem>
            </Nav>
          </UncontrolledCollapse>
        </Container>
      </Navbar>
    </>
  );
};

export default AuthNavbar;
