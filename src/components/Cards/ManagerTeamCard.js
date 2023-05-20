import React from "react";

import { Button, Card, CardHeader, CardBody, Row } from "reactstrap";
import { API_BASE_URL, TWITTER_BASE_URL } from "constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import Chip from "@mui/material/Chip";
import { Stack } from "@mui/system";
import { Avatar } from "@mui/material";
import ReactCountryFlag from "react-country-flag";
const clm = require("country-locale-map");

const ManagerTeamCard = (props) => {
  const { managerItem } = props;
  return (
    <>
      {managerItem && (
        <Card className="shadow mb-4" style={{ flexBasis: "49%" }}>
          <CardHeader className="border-0">
            <Row className="align-items-center">
              <div className="col">
                <h2 className="mb-0" style={{ fontWeight: "bold" }}>
                  {managerItem.name}
                </h2>
              </div>
            </Row>
          </CardHeader>
          <CardBody className="d-flex flex-column">
            <div className="d-flex justify-content-center">
              <div className="d-flex flex-column">
                <Avatar
                  src={API_BASE_URL + "/" + managerItem.image}
                  sx={{ width: 80, height: 80, marginBottom: 1 }}
                  alt={managerItem.name}
                />
              </div>
              
            </div>

            <div>
                <h2 className="mb-0" style={{ fontWeight: "bold" }}>
                  {managerItem.userName}
                </h2>
              </div>
              <div>
                <h3 className="mb-0" style={{ fontWeight: "bold" }}>
                  {managerItem.email}
                </h3>
              </div>
          </CardBody>
        </Card>
      )}
    </>
  );
};

export default ManagerTeamCard;
