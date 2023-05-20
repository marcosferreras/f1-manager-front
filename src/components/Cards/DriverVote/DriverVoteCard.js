import React from 'react'
import { Card, CardHeader, CardBody, Row, Button } from "reactstrap";
import { Avatar, Chip } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import ReactCountryFlag from "react-country-flag";
import { API_BASE_URL } from 'constants';
import { TWITTER_BASE_URL } from 'constants';
import { faCheckToSlot, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import Badge from '@mui/material/Badge';
import { Stack } from "@mui/system";
import "./DriverVoteCard.css";
const clm = require('country-locale-map');


const DriverVoteCard = (props) => {
    const { driverItem, votes, handleVoteClick, surveyId } = props;
    return (
        <>
            {driverItem && (
                <Card className="shadow mb-4" style={{ flexBasis: '49%' }}>
                    <CardHeader className="border-0">
                        <Row className="align-items-center">
                            <div className="col d-flex flex-column">
                                <h2 className="mb-0">{`${driverItem.name} ${driverItem.lastName}`}</h2>
                                {driverItem.teamDto && (
                                    <h4 className="mb-0 mt-2">{`${driverItem.teamDto.name}`}</h4>)
                                }
                            </div>
                            <div className="col text-right">
                                <Button
                                    style={{ backgroundColor: "#525f7f", borderColor: "#525f7f", color: "#FFFFFF" }}
                                    onClick={() => handleVoteClick(
                                        {
                                            driver: driverItem,
                                            surveyId: surveyId,
                                        }
                                    )}
                                    size="sm"
                                >
                                    <span>Votar</span>
                                    <FontAwesomeIcon icon={faThumbsUp} />
                                </Button>
                            </div>
                        </Row>
                    </CardHeader>
                    <CardBody>
                        <div className="text-center">
                            <Badge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                badgeContent={driverItem.teamDto && (
                                    <img alt={driverItem.teamDto.name} src={API_BASE_URL + driverItem.teamDto.logo} style={{ width: '130px' }} />
                                )}
                            >
                                <Avatar alt={driverItem.name} src={API_BASE_URL + driverItem.image} className="driver-avatar" />
                            </Badge>
                        </div>
                        <Stack direction={'row'} spacing={0} sx={{ flexWrap: 'wrap', gap: 1, marginTop: 2, justifyContent: 'space-around' }}>
                            <div className="d-flex flex-column align-items-center mb-3">
                                <h2>
                                    <span> <ReactCountryFlag countryCode={clm.getAlpha2ByName(driverItem.country)} /> </span>
                                    <span className="font-italic">{`${driverItem.acronym} ${driverItem.number}`}</span>
                                </h2>
                                <Chip
                                    icon={<FontAwesomeIcon icon={faTwitter} style={{ color: "#1DA1F2" }} />}
                                    label={`${driverItem.name} ${driverItem.lastName}`}
                                    onClick={() => window.open(TWITTER_BASE_URL + "/" + driverItem.twitter, "_blank")}
                                />
                                {Number.isInteger(votes) && (
                                    <div className='mt-3'>
                                        <h2>
                                            {votes} {votes === 1 ? 'vote' : 'votes'} <FontAwesomeIcon icon={faCheckToSlot} style={{ color: "#b20600" }} />
                                        </h2>
                                    </div>
                                )}
                            </div>
                        </Stack>
                    </CardBody>
                </Card>
            )}
        </>
    )
}

export default DriverVoteCard
