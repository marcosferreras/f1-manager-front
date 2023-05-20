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
import SearchInput from "components/SearchInput/SearchInput";
import { Chip } from "@mui/material";
import { Stack } from "@mui/system";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faInfo, faRemove, faTrash, faUser } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { API_URL_CONSTANTS } from "constants";
import { ADMIN_TEAMS_DETAILS } from "constants";
import Paginator from "components/Paginator/Paginator";
import TeamCard from "components/Cards/TeamCard";
import { API_BASE_URL } from "constants";

const TeamsInformation = (props) => {
  const [activeNav, setActiveNav] = useState(1);
  const [teams, setTeams] = useState({
    content: [{
      id: 1,
      name: "Ferrari",
      drivers: [{
        id: 1,
        name: "Carlitros",
        lastName: "Seins",
        acronym: "CS5",
        number: 55,
        image: "https://graffica.info/wp…ogo-Ferrari-1024x529.png",
        country: "sdfsdf",
        twitter: "www.google.es",
      }],
      logo: "https://graffica.info/wp-content/uploads/2016/08/logo-Ferrari-1024x529.png",
      twitter: "https://www.google.com",
    }],
    totalPages: 8,
    size: 2
  });
  const [page, setPage] = useState(0);
  const [teamForDetailsItem, setTeamForDetailsItem] = useState(null);


  useEffect(() => {
    // Retrieve teams from API
    axios.get(API_URL_CONSTANTS.API_TEAMS_URL + `?page=${page}&size=${ADMIN_TEAMS_DETAILS.PAGE_SIZE}`).then((response) => {
      if (response) {
        setTeams(response.data);
      }
    })

  }, [page]);

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
                    <h2 className="text-white mb-0">Racing Teams</h2>
                  </div>
                </Row>
              </CardHeader>
              {teams.totalElements === 0 && (
                <CardBody>
                  <div className="text-center bg-white pt-3">
                    <FontAwesomeIcon icon={faCircleInfo} color="#b20600" size="3x" />
                    <h3 className="text-black">No available teams</h3>
                  </div>
                </CardBody>
              )}
              {teams.totalElements > 0 && (
                <Table className="align-items-center table-flush bg-white" responsive>
                  <thead className="thead-dark">
                    {teams.totalElements === 0 && (
                      <CardBody>
                        <div className="text-center bg-white">
                          <FontAwesomeIcon icon={faCircleInfo} color="#b20600" size="3x" />
                          <h3 className="text-black">No available teams</h3>
                        </div>
                      </CardBody>
                    )}
                    <tr>
                      <th className="text-white text-center" scope="col">Team</th>
                      <th className="text-white text-center" scope="col">ID</th>
                      <th className="text-white text-center" scope="col">Drivers</th>
                      <th className="text-white text-center" scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(teams.content) && teams.content.map((team) => (
                      <tr>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="w-50 d-flex justify-content-center">
                              <img src={API_BASE_URL + team.logo} alt={team.name} height={'45px'} />
                            </div>
                            <div className="align-items-center d-flex w-50 font-weight-bold">
                              <h4 className="m-0">{team.name}</h4>
                            </div>
                          </div>
                        </td>
                        <td className="text-center">#{team.id}</td>
                        <td>
                          <div className="d-flex justify-content-center">
                            <Stack direction="row" spacing={1}>
                              {team.drivers.map((driver) => (
                                <Chip
                                  style={{ padding: '0px 5px' }}
                                  icon={<FontAwesomeIcon icon={faUser} />}
                                  label={driver.name}
                                  key={driver.id}
                                />
                              ))}
                            </Stack>
                          </div>
                        </td>
                        <td className="text-center">
                          <div className="col text-right">
                            <Button
                              color="default"
                              href="#pablo"
                              onClick={() => setTeamForDetailsItem(team)}
                              size="sm"
                            >
                              <FontAwesomeIcon icon={faCircleInfo} /> See details
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}

                  </tbody>
                </Table>
              )}
              <div className="bg-white pt-3 pb-3">
                <Paginator totalPages={teams.totalPages} setPage={setPage} />
              </div>
            </Card>
          </Col>
          <Col xl="4 m-auto">
            <TeamCard teamItem={teamForDetailsItem} />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default TeamsInformation;
