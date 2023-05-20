import { useEffect, useState } from "react";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Table,
  Container,
  Row,
  Col
} from "reactstrap";

import Header from "components/Headers/Header.js";
import Paginator from "components/Paginator/Paginator";
import { Stack } from "@mui/system";
import { Avatar, Chip } from "@mui/material";
import { faCheck, faCircleInfo, faEnvelope, faPaperPlane, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { API_URL_CONSTANTS } from "constants";
import { useSnackbar } from "notistack";
import axios from "axios";
import SearchInput from "components/SearchInput/SearchInput";
import { TEAMS } from "constants";

const TeamLeadersManagement = (props) => {

  const [availableManagers, setAvailableManagers] = useState({
    content: [{
      id: 1,
      name: "Carlitros",
      email: "marc@genio.esl",
      userName: "marc.gene",
    }],
    totalPages: 8,
    size: 2
  });
  const [page, setPage] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentTeamData, setCurrentTeamData] = useState(null);
  const [filterName, setFilterName] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const handleJoinTeam = () => {
    axios.post(API_URL_CONSTANTS.API_USERS_URL + `/add-manager-team`, {
      idUser: selectedUser.id,
      idTeam: currentTeamData.id
    }).then((response) => {
      if (response.status === 200) {
        enqueueSnackbar(`The user ${selectedUser.name} is now a manager of the team`, { variant: "success", anchorOrigin: { vertical: 'bottom', horizontal: 'left' } });
        setSelectedUser(null);
      } else {
        enqueueSnackbar("Error, try again later", { variant: "error" });
      }
    }).catch((error) => {
      enqueueSnackbar("Error, try again later", { variant: "error" });
    });
  };

  useEffect(() => {
    if (selectedUser == null) {
      axios.post(API_URL_CONSTANTS.API_USERS_URL + `/managers-without-team`, {
        name: filterName
      }).then((response) => {
        if (response.status === 200) {
          setAvailableManagers(response.data);
        } else {
          enqueueSnackbar("Error retrieving pending users", { variant: "error" });
        }
      }).catch((error) => {
        enqueueSnackbar("Error retrieving pending users", { variant: "error" });
      });
    }
    // Retrieve available roles from API
  }, [page, selectedUser, filterName]);

  useEffect(() => {
    axios.get(API_URL_CONSTANTS.API_TEAMS_URL + `/manager-team`).then((response) => {
      if (response.status === 200) {
        setCurrentTeamData(response.data);
      } else {
        enqueueSnackbar("Error retrieving current team", { variant: "error" });
      }
    }).catch((error) => {
      enqueueSnackbar("Error retrieving current team", { variant: "error" });
    });
  }, []);

  const handleSearch = (event) => {
    setFilterName(event.target.value);
  };

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="mb-5 mb-xl-0" xl="8">
            {currentTeamData && availableManagers && (
              <Card className="bg-default shadow overflow-hidden">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-light ls-1 mb-1">
                        Overview
                      </h6>
                      <h2 className="text-white mb-0">Available managers to join {currentTeamData.name}</h2>
                    </div>
                    <div className="col-6 col-md-4 text-right">
                      <SearchInput placeHolder={TEAMS.SEARCH_PLACEHOLDER} handleSearch={handleSearch} />
                    </div>
                  </Row>
                </CardHeader>
                {availableManagers.totalElements === 0 && (
                  <div className="text-center bg-white pt-3">
                    <FontAwesomeIcon icon={faCircleInfo} color="#b20600" size="3x" />
                    <h3 className="text-black">No available managers</h3>
                  </div>
                )}
                {availableManagers.totalElements > 0 && (
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
                      {Array.isArray(availableManagers.content) && availableManagers.content.map((user) => (
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
                                <FontAwesomeIcon icon={faPaperPlane} /> Add to team
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}

                    </tbody>
                  </Table>
                )}
                <div className="bg-white pt-3 pb-3">
                  <Paginator totalPages={availableManagers.totalPages} setPage={setPage} />
                </div>
              </Card>
            )}
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
                      <h2 className="mb-0">Do you want to accept {selectedUser.name} as team manager?</h2>
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
                    <div className="d-flex mt-5 justify-content-around">
                      <Button
                        color="primary"
                        onClick={() => { setSelectedUser(null) }}
                        size="m"
                      >
                        <FontAwesomeIcon icon={faXmark} /> Close
                      </Button>
                      <Button
                        color="default"
                        onClick={() => { handleJoinTeam() }}
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

export default TeamLeadersManagement;
