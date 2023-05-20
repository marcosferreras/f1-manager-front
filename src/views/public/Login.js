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
  Col
} from "reactstrap";
import { Link, useHistory } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { loginUser } from "services/auth/AuthService";
import { useSnackbar } from "notistack";
import AuthContext from "../../services/auth/AuthContext";
import { ROLES, DASHBOARD_LANDING_PAGES } from "../../constants";
import Loading from "components/Loading/Loading";


const Login = () => {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { authData, setAuthData } = useContext(AuthContext);
  const history = useHistory();

  useEffect(() => {
    const landingPage = getLandingPage(authData);
    if (landingPage) {
      history.push(landingPage);
    }
  }, [authData, history]);

  const getLandingPage = (authData) => {
    if (authData && Array.isArray(authData.authorities)) {
      const isAdmin = authData.authorities.find((role) => {
        if (role.authority === ROLES.ADMIN) {
          return true;
        }
        return false;
      });
      if (isAdmin) {
        return DASHBOARD_LANDING_PAGES.ADMIN;
      }
      return DASHBOARD_LANDING_PAGES.TEAM;
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const credentials = {
      userName: username,
      password: password,
    }
    if (username && password) {
      setIsLoading(true);
      loginUser(credentials).then(
        (data) => {
          setAuthData(data);
        },
        (error) => {
          //if error is 401, show error message, else show generic error
          if (error.toString().includes(401)) {
            //Show error message
            enqueueSnackbar('Invalid username or password', {
              variant: 'error'
            });
          } else {
            //Show notistack error notification
            enqueueSnackbar("Something went wrong, please try again later", {
              variant: 'error',
            });
          }
          setIsLoading(false);
        }
      );
    }
  }

  return (
    <>
      {isLoading && (
        <Loading />
      )}
      <Col lg="6" md="8">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <h1>Login</h1>
            </div>
            <Form role="form" onSubmit={handleLogin}>
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Username"
                    type="text"
                    name="username"
                    onChange={(e) => setUsername(e.target.value)}
                    required
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
                    name="password"
                    placeholder="Password"
                    type="password"
                    autoComplete="password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </InputGroup>
              </FormGroup>
              <div className="custom-control custom-control-alternative custom-checkbox">
                <input
                  className="custom-control-input"
                  id=" customCheckLogin"
                  type="checkbox"
                />
                <label
                  className="custom-control-label"
                  htmlFor=" customCheckLogin"
                >
                  <span className="text-muted">Remember me</span>
                </label>
              </div>
              <div className="text-center">
                <Button className="my-4" color="primary">
                  Login
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
        <Row className="mt-3">
          <Col xs="6">
            <a
              className="text-light"
              href="#pablo"
              onClick={(e) => e.preventDefault()}
            >
              <small>Forgot password?</small>
            </a>
          </Col>
          <Col className="text-right" xs="6">
            <Link
              className="text-light"
              to="/auth/register"
            >
              <small>Create new account</small>
            </Link>
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default Login;
