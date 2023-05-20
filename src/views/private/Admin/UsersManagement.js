import { useEffect, useState } from "react";
// node.js library that concatenates classes (strings)
import classnames from "classnames";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col
} from "reactstrap";

import Header from "components/Headers/Header.js";
import Paginator from "components/Paginator/Paginator";
import { Box, Stack } from "@mui/system";
import { Avatar, Chip, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { faCheck, faCircleInfo, faCross, faEnvelope, faPaperPlane, faUser, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { API_URL_CONSTANTS } from "constants";
import { ADMIN_REVIEW_USERS_DETAILS } from "constants";
import { useSnackbar } from "notistack";
import axios from "axios";
import SearchInput from "components/SearchInput/SearchInput";
import { USERS_MANAGEMENT } from "constants";
import { ADMIN_USERS_MANAGEMENT } from "constants";

const UsersManagement = (props) => {

  const [pendingUsers, setPendingUsers] = useState({
    content: [{
      id: 1,
      name: "Carlitros",
      email: "marc@genio.esl",
      userName: "marc.gene",
    }],
    totalPages: 8,
    size: 2
  });
  const [availableRoles, setAvailableRoles] = useState([
    {
      id: 1,
      rolName: "ROL_ADMIN",
    },
    {
      id: 2,
      rolName: "ROL_MANAGER",
    },
  ]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [page, setPage] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filterName, setFilterName] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const handleDeclineRequest = () => {
    if (selectedUser) {
      axios.delete(API_URL_CONSTANTS.API_USERS_URL + `/cancel-user/${selectedUser.id}`).then((response) => {
        if (response.status === 200) {
          enqueueSnackbar("The request was declined successfully", { variant: "success" });
          resetInterface();
        } else {
          enqueueSnackbar("Error, try again later", { variant: "error" });
        }
      }).catch((error) => {
        enqueueSnackbar("Error, try again later", { variant: "error" });
      });
    } else {
      enqueueSnackbar("Please select both user and role", { variant: "error", });
    }
  };

  const handleAcceptRequest = () => {
    if (selectedUser && selectedRole) {
      axios.post(API_URL_CONSTANTS.API_USERS_URL + `/add-rol-user`, {
        idUser: selectedUser.id,
        rol: {
          rolName: selectedRole.rolName,
        }
      }).then((response) => {
        if (response.status === 200) {
          enqueueSnackbar("The user was sucessfully granted", { variant: "success", anchorOrigin: { vertical: 'bottom', horizontal: 'left' } });
          setSelectedUser(null);
          setSelectedRole(null);
        } else {
          enqueueSnackbar("Error, try again later", { variant: "error" });
        }
      }).catch((error) => {
        enqueueSnackbar("Error, try again later", { variant: "error" });
      });
    } else {
      enqueueSnackbar("Please select both user and role", { variant: "error", });
    }
  };

  const resetInterface = () => {
    setSelectedUser(null);
    setFilterName('');
  };

  const handleSearch = (event) => {
    setFilterName(event.target.value);
  };


  useEffect(() => {
    // Retrieve pending users from API
    axios.post(API_URL_CONSTANTS.API_USERS_URL + `/users-without-rol?page=${page}&size=${ADMIN_USERS_MANAGEMENT.PAGE_SIZE}`, {
      name: filterName
    }).then((response) => {
      if (response.status === 200) {
        setPendingUsers(response.data);
      } else {
        enqueueSnackbar("Error retrieving pending users", { variant: "error" });
      }
    }).catch((error) => {
      enqueueSnackbar("Error retrieving pending users", { variant: "error" });
    });
    // Retrieve available roles from API
  }, [page, selectedUser, filterName]);

  useEffect(() => {
    axios.get(API_URL_CONSTANTS.API_USERS_URL + "/roles").then((response) => {
      if (response.status === 200) {
        setAvailableRoles(response.data);
      } else {
        enqueueSnackbar("Error retrieving pending users", { variant: "error" });
      }
    }).catch((error) => {
      enqueueSnackbar("Error retrieving available roles", { variant: "error" });
    });
  }, []);

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="bg-default shadow overflow-hidden">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-light ls-1 mb-1">
                      Overview
                    </h6>
                    <h2 className="text-white mb-0">Users pending registration</h2>
                  </div>
                  <div className="col-6 col-md-4 text-right">
                    <SearchInput placeHolder={ADMIN_USERS_MANAGEMENT.SEARCH_PLACEHOLDER} handleSearch={handleSearch} />
                  </div>
                </Row>
              </CardHeader>
              {pendingUsers.totalElements === 0 && (
                <div className="text-center bg-white pt-3">
                  <FontAwesomeIcon icon={faCircleInfo} color="#b20600" size="3x" />
                  <h3 className="text-black">No available users</h3>
                </div>
              )}
              {pendingUsers.totalElements > 0 && (
                <Table className="align-items-center table-flush bg-white" responsive>
                  <thead className="thead-dark">
                    <tr>
                      <th className="text-white text-center" scope="col">Username</th>
                      <th className="text-white text-center" scope="col">Name</th>
                      <th className="text-white text-center" scope="col">Email</th>
                      <th className="text-white text-center" scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(pendingUsers.content) && pendingUsers.content.map((user) => (
                      <tr>
                        <td className="text-center">{user.userName}</td>
                        <td className="text-center">{user.name}</td>
                        <td>
                          <div className="d-flex justify-content-center">
                            <Stack direction="row" spacing={1}>
                              <Chip
                                style={{ padding: '0px 5px' }}
                                icon={<FontAwesomeIcon icon={faEnvelope} />}
                                label={user.email}
                              />
                            </Stack>
                          </div>
                        </td>
                        <td className="text-center">
                          <div className="col text-right">
                            <Button
                              color="default"
                              onClick={() => setSelectedUser(user)}
                              size="sm"
                            >
                              <FontAwesomeIcon icon={faPaperPlane} /> Review request
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}

                  </tbody>
                </Table>
              )}
              <div className="bg-white pt-3 pb-3">
                <Paginator totalPages={pendingUsers.totalPages} setPage={setPage} />
              </div>
            </Card>
          </Col>
          <Col xl="4 m-auto">
            {selectedUser && (
              <Card className="shadow mb-4" style={{ flexBasis: '49%' }}>
                <CardHeader className="border-0">
                  <Row>
                    <div className="col text-right">
                      <a href="" onClick={(e) => { e.preventDefault(); setSelectedUser(null) }}>
                        <FontAwesomeIcon icon={faXmark} />
                      </a>
                    </div>
                  </Row>
                  <Row className="align-items-center">
                    <div className="col">
                      <h2 className="mb-0">Do you want to accept {selectedUser.name} registration?</h2>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  <div className="d-flex justify-content-center flex-column">
                    <div className="d-flex flex-column justify-content-center align-items-center">
                      <Avatar sx={{ bgcolor: '#1c3f6e', width: '100px', height: '100px' }}>{
                        selectedUser.name.split(" ").map((name) => name.charAt(0)).join("").substring(0, 2)
                      }</Avatar>
                      <h3 className="mt-2">{selectedUser.name}</h3>
                    </div>
                    <div className="d-flex align-items-center justify-content-center mt-4">
                      <div className="col-4 text-center">
                        <h3>Choose rol</h3>
                      </div>
                      <div className="col-6">
                        <Box sx={{ minWidth: 140 }}>
                          <FormControl fullWidth>
                            <InputLabel id="select-label">Rol</InputLabel>
                            <Select
                              labelId="select-label"
                              id="simple-select"
                              value={selectedRole}
                              label="Rol"
                              onChange={(evt) => setSelectedRole(evt.target.value)}
                            >
                              {Array.isArray(availableRoles) && availableRoles.map((role) => (
                                <MenuItem value={role}>{role.rolName}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Box>
                      </div>

                    </div>
                    <div className="d-flex mt-5 justify-content-around">
                      <Button
                        color="primary"
                        onClick={() => { handleDeclineRequest() }}
                        size="m"
                      >
                        <FontAwesomeIcon icon={faXmark} /> Decline
                      </Button>
                      <Button
                        color="default"
                        onClick={() => { handleAcceptRequest() }}
                        size="m"
                      >
                        <FontAwesomeIcon icon={faCheck} /> Accept
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default UsersManagement;
