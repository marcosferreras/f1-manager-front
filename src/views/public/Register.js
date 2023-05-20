import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
  Alert
} from "reactstrap";

import { useState } from "react";
import { passwordStrength } from 'check-password-strength';
import axios from "axios";
import { API_URL_CONSTANTS, HTTP_STATUS } from "constants";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";

const Register = () => {

  const [password, setPassword] = useState(null);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [username, setUsername] = useState(null);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const { enqueueSnackbar } = useSnackbar()
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwordMatch && password && name && email && username) {
      const strength = passwordStrength(password).value;
      if(strength === "Too weak") {
        enqueueSnackbar("Password is too weak, please change it", { variant: "error" });
        return;
      }
      const userData = {
        name: name,
        userName: username,
        email: email,
        password: password
      }
      axios.post(API_URL_CONSTANTS.API_REGISTER_URL, userData)
        .then((res) => {
          history.push("/auth/login");
          enqueueSnackbar("User registered successfully", { variant: "success" });
        })
        .catch((err) => {
          if (err.response.status === HTTP_STATUS.BAD_REQUEST && err.response.data.message) {
            enqueueSnackbar(err.response.data.message, { variant: "error" });
          } else {
            enqueueSnackbar("Something went wrong", { variant: "error" });
          }
        })
    } else {
      setShowAlert(true);
    }
  }

  const handlePasswordRepeatChange = (e) => {
    setPasswordMatch(e.target.value === password);
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
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
      <Col lg="6" md="8">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <h1>Sign up</h1>
            </div>
            <Form role="form" onSubmit={handleSubmit}>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-single-02" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input placeholder="Name" type="text" name="name" onChange={(e) => setName(e.target.value)} />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-badge" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input placeholder="Username" type="text" name="username" onChange={(e) => setUsername(e.target.value)} />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Email"
                    type="email"
                    autoComplete="email"
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Password"
                    type="password"
                    autoComplete="new-password"
                    name="password"
                    onChange={handlePasswordChange}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Repeat password"
                    type="password"
                    onChange={handlePasswordRepeatChange}
                  />
                </InputGroup>
                {!passwordMatch && (
                  <div className="text-muted font-italic mt-1">
                    <small>
                      <div className="text-danger font-weight-700">Those passwords didn’t match. Try again.</div>
                    </small>
                  </div>
                )}
              </FormGroup>
              {password && password!=="" && (
                <div className="text-muted font-italic">
                  <small>
                    password strength:{" "}
                    {renderPasswordStrength()}
                  </small>
                </div>
              )}
              <Row className="my-4">
                <Col xs="12">
                  <div className="custom-control custom-control-alternative custom-checkbox">
                    <input
                      className="custom-control-input"
                      id="customCheckRegister"
                      type="checkbox"
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="customCheckRegister"
                    >
                      <span className="text-muted">
                        I agree with the{" "}
                        <a href="#pablo" onClick={(e) => e.preventDefault()}>
                          Privacy Policy
                        </a>
                      </span>
                    </label>
                  </div>
                </Col>
              </Row>
              {showAlert && (
                <Row className="my-1">
                  <Col xs="12">
                    <Alert color="primary">
                      <strong>Validation error!</strong> Check the fields!
                    </Alert>
                  </Col>
                </Row>
              )}
              <div className="text-center">
                <Button className="mt-2" color="primary" >
                  Create account
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </>
  );
};

export default Register;
