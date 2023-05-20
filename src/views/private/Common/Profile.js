// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
  FormFeedback,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
} from "reactstrap";
// core components
import UserHeader from "components/Headers/UserHeader.js";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL_CONSTANTS } from "constants";
import { useSnackbar } from 'notistack';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { passwordStrength } from 'check-password-strength';
import { API_BASE_URL } from "constants";

const Profile = () => {

  const [userData, setUserData] = useState(/*{
    username: "marc.gene",
    role: "ADMIN",
    name: "Marc Gené",
    email: "marc@gene.com",
  }*/);
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    //Retrieve user data from backend with axios
    axios.get(API_URL_CONSTANTS.API_USERS_URL + '/user-details').then((response) => {
      if (response) {
        setUserData(response.data);
      }
    })
  }, []);

  const updatePersonalData = () => {
    if (userData.name && userData.email) {
      //Update user data with axios
      axios.put(API_URL_CONSTANTS.API_USERS_URL + '/update-user', {
        name: userData.name,
        email: userData.email,
      }).then((response) => {
        if (response.status === 200) {
          enqueueSnackbar('Personal data updated', {
            variant: 'success',
          });
        }
      })
    } else {
      enqueueSnackbar('Please fill all the fields', {
        variant: 'error',
      });
    }
  }

  const updatePassword = () => {
    if (password && repeatPassword && password === repeatPassword) {
      //Update user password with axios
      axios.put(API_URL_CONSTANTS.API_USERS_URL + '/update-user', { password }).then((response) => {
        if (response.status === 200) {
          enqueueSnackbar('Password updated', {
            variant: 'success',
          });
        }
      })
    } else {
      enqueueSnackbar('Please fill all the fields and repeat the password correctly', {
        variant: 'error',
      });
    }
  }


  const renderPasswordStrength = () => {
    const strength = passwordStrength(password).value;
    if (strength === 'Too weak') {
      return (<span className="text-danger font-weight-700">Too week</span>);
    } else if (strength === 'Weak') {
      return (<span className="text-warning font-weight-700">Medium</span>);
    } else if (strength === 'Strong') {
      return (<span className="text-success font-weight-700">Strong</span>);
    }
  }


  return (
    <>
      <UserHeader displayName={userData ? userData.name : ''} />
      {/* Page content */}
      {userData && (
        <Container className="mt--7" fluid>
          <Row>
            <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
              <Card className="card-profile shadow">
                <Row className="justify-content-center">
                  <Col className="order-lg-2" lg="3">
                    <div className="card-profile-image">
                      <a href="#pablo" onClick={(e) => e.preventDefault()}>
                        <img
                          alt="..."
                          className="rounded-circle"
                          src={require("../../../assets/img/theme/profile-photo.jpeg")}
                        />
                      </a>
                    </div>
                  </Col>
                </Row>
                <CardBody className="pt-0 mt-8">
                  <div className="text-center mt-md-2 mt-3">

                    <h2 className="bg-primary mb-4" style={{ color: "white", textAlign: 'center', borderRadius: '6px' }}>{
                      userData.name
                    }
                    </h2>
                    {userData.teamManager && (
                      <div className="d-flex align-items-center justify-content-center">
                        <div className="d-flex justify-content-center">
                          <img src={API_BASE_URL + userData.teamManager.logo} alt={userData.teamManager.name} height={'55px'} />
                        </div>
                        <div className="align-items-center d-flex font-weight-bold">
                          <h3 className="m-0">{userData.teamManager.name}</h3>
                        </div>
                      </div>
                    )}
                    {!userData.teamManager && (
                      <div className="d-flex align-items-center justify-content-center">
                        <div className="align-items-center d-flex font-weight-bold">
                          <h3 className="m-0">{userData.role.rolName==="ROL_MANAGER" ? 'Manager' : 'Administrador'}</h3>
                        </div>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col className="order-xl-1" xl="8">
              <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <Col xs="8">
                      <h2 className="mb-0">My profile</h2>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Form>
                    <h3 className="text-uppercase mb-4">
                      User information
                    </h3>
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-username"
                            >
                              Username
                            </label>
                            <Input
                              className="form-control-alternative text-dark"
                              value={userData.userName}
                              readOnly
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-role"
                            >
                              Role
                            </label>
                            <Input
                              className="form-control-alternative text-dark"
                              defaultValue={userData.rol ? userData.role.rolName : ""}
                              readOnly
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-first-name"
                            >
                              Full name
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue={userData.name}
                              id="input-first-name"
                              placeholder="Full name"
                              type="text"
                              invalid={userData.name ? false : true}
                              onChange={(e) => { setUserData({ ...userData, name: e.target.value }) }}
                            />
                            <FormFeedback style={{ color: "red" }}>
                              Full name is required
                            </FormFeedback>
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-email"
                            >
                              Email address
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-email"
                              placeholder="jesse@example.com"
                              type="email"
                              defaultValue={userData.email}
                              invalid={userData.email ? false : true}
                              onChange={(e) => { setUserData({ ...userData, email: e.target.value }) }}
                            />
                            <FormFeedback style={{ color: "red" }}>
                              Email is required
                            </FormFeedback>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="6" xs="4">
                          <Button
                            color="primary"
                            href="#pablo"
                            onClick={updatePersonalData}
                            size="sm"
                          >
                            Update personal info
                          </Button>
                        </Col>
                      </Row>
                    </div>
                    <hr className="my-4" />
                    {/* Address */}
                    <h3 className="text-uppercase mb-4">
                      Password settings
                    </h3>
                    <div className="pl-lg-4">
                      <Row>
                        <Col md="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-password"
                            >
                              Password
                            </label>
                            <InputGroup className="input-group-alternative">
                              <Input
                                className="form-control-alternative"
                                id="input-password"
                                placeholder="Password"
                                type={showPassword ? "text" : "password"}
                                onChange={(e) => { setPassword(e.target.value) }}
                                invalid={password ? false : true}
                              />
                              <InputGroupAddon addonType="append">
                                <InputGroupText>
                                  <FontAwesomeIcon
                                    icon={showPassword ? faEyeSlash : faEye}
                                    onClick={() => setShowPassword(!showPassword)}
                                  />
                                </InputGroupText>
                              </InputGroupAddon>
                            </InputGroup>
                            {password && password !== "" && (
                              <div className="text-muted font-italic">
                                <small>
                                  password strength:{" "}
                                  {renderPasswordStrength()}
                                </small>
                              </div>
                            )}
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-repeat-password"
                            >
                              Repeat password
                            </label>
                            <InputGroup className="input-group-alternative">
                              <Input
                                className="form-control-alternative"
                                id="input-repeat-password"
                                placeholder="Repeat password"
                                type={showRepeatPassword ? "text" : "password"}
                                onChange={(e) => { setRepeatPassword(e.target.value) }}
                                invalid={(repeatPassword !== "" && repeatPassword !== password) ? true : false}
                              />
                              <InputGroupAddon addonType="append">
                                <InputGroupText>
                                  <FontAwesomeIcon
                                    icon={showRepeatPassword ? faEyeSlash : faEye}
                                    onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                                  />
                                </InputGroupText>
                              </InputGroupAddon>
                            </InputGroup>
                            {repeatPassword !== "" && repeatPassword !== password && (
                              <div className="text-muted font-italic">
                                <small style={{ color: 'red' }}>
                                  Passwords do not match
                                </small>
                              </div>
                            )}
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="6" xs="4">
                          <Button
                            color="primary"
                            href="#pablo"
                            onClick={updatePassword}
                            size="sm"
                          >
                            Change password
                          </Button>
                        </Col>
                      </Row>
                    </div>
                    <hr className="my-4" />
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      )}

    </>
  );
};

export default Profile;
