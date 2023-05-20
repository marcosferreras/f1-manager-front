import React from "react";
import { 
    Grid
} from "@mui/material";
import DriverCard from "./DriverCard";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { API_BASE_URL } from 'constants';
import { Chip } from '@mui/material';
import { Card, CardHeader, CardBody, Row } from "reactstrap";


const VotationCard = (props) => {
    const {votationItem} = props;
    return (
        <>
            {votationItem && (
                <Card className="shadow mb-4" style={{ flexBasis: "49%" }}>
                    <CardHeader className="border-0">
                        <h2 className="mb-0" style={{ fontWeight: "bold" }}>
                            {votationItem.title} {
                                <Chip
                                icon={<FontAwesomeIcon icon="fa-solid fa-link" style={{ color: "#1DA1F2" }} />}
                                label={"Open Link"}
                                key={votationItem.title}
                                onClick={() => window.open(votationItem.link, "_blank")}
                                />
                            }
                        </h2>
                    </CardHeader>
                    <CardBody className="d-flex flex-column">
                        <div>
                            <h3 className="mb-0" style={{ fontWeight: "bold" }}>
                                {votationItem.description}
                            </h3>
                        </div>
                        <div>
                            <h3>
                                Limit Date: {votationItem.limitDate}
                            </h3>
                        </div>
                        <div>
                            <Grid container spacing={2}>
                                {votationItem.drivers.map((driver) => (
                                    <Grid item xs={6} sm={6} md={4}>
                                        <DriverCard driverItem={driver} votes={votationItem.votes.filter((voteItem)=>{
                                            return voteItem.driverId === driver.id;
                                        }).length}/>
                                    </Grid>
                                ))}
                            </Grid>
                        </div>
                    </CardBody>
                </Card>
            )}
        </>
    );
}

export default VotationCard