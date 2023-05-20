import React from 'react'
import { Card, CardHeader, CardBody, Row } from "reactstrap";
import { Avatar, Chip } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import ReactCountryFlag from "react-country-flag";
import { API_BASE_URL } from 'constants';
import { TWITTER_BASE_URL } from 'constants';
import { faCheckToSlot } from '@fortawesome/free-solid-svg-icons';
const clm = require('country-locale-map');


const DriverCard = (props) => {
    const { driverItem, votes } = props;
    return (
        <>
            {driverItem && (
                <Card className="shadow" style={{ flexBasis: '40%' }}>
                    <CardHeader className="border-0">
                        <Row className="align-items-center">
                            <div className="col">
                                <h2 className="mb-0" style={{ fontWeight: 'bold' }}>{driverItem.name} {driverItem.lastName}</h2>
                            </div>
                        </Row>
                    </CardHeader>
                    <CardBody>
                        <div className="text-center d-flex flex-column">
                            <div className="d-flex justify-content-center">
                                <div className="d-flex flex-column">
                                    <Avatar
                                        src={API_BASE_URL + driverItem.image}
                                        sx={{ width: 80, height: 80, marginBottom: 1 }}
                                        alt={driverItem.name}
                                    />
                                </div>
                            </div>


                            <div>
                                <h2>
                                    <span> <ReactCountryFlag countryCode={clm.getAlpha2ByName(driverItem.country)} /> </span>
                                    <span className="font-italic">{`${driverItem.acronym} ${driverItem.number}`}</span>
                                </h2>
                                <Chip
                                    icon={<FontAwesomeIcon icon={faTwitter} style={{ color: "#1DA1F2" }} />}
                                    label={`${driverItem.name} ${driverItem.lastName}`}
                                    key={driverItem.name}
                                    onClick={() => window.open(TWITTER_BASE_URL + "/" + driverItem.twitter, "_blank")}
                                />
                            </div>
                            {Number.isInteger(votes) && (
                                <div className='mt-3'>
                                    <h2>
                                        {votes} {votes === 1 ? 'vote':'votes'} <FontAwesomeIcon icon={faCheckToSlot} style={{ color: "#b20600" }} />
                                    </h2>
                                </div>
                            )}

                        </div>
                    </CardBody>
                </Card>
            )}
        </>
    )
}

export default DriverCard
