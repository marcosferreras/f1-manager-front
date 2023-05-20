import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Chip from '@mui/material/Chip';
import { Grid } from '@mui/material';
import ReactCountryFlag from "react-country-flag";
import { Card, CardHeader, CardBody, Row } from "reactstrap";
import { faFlagCheckered } from '@fortawesome/free-solid-svg-icons';
import { API_BASE_URL } from 'constants';
const clm = require('country-locale-map');

const CircuitCard = (props) => {
    const { circuitItem } = props;
    return (
        <>
            {circuitItem && (
                <Card className="shadow" style={{ flexBasis: '40%' }}>
                    <CardHeader className="border-0">
                        <Row className="align-items-center">
                            <div className="col">
                                <h2 className="mb-0" style={{fontWeight:'bold'}}><span> <ReactCountryFlag countryCode={clm.getAlpha2ByName(circuitItem.country)} /> </span> {circuitItem.name}</h2>
                            </div>
                        </Row>
                    </CardHeader>
                    <CardBody>
                        <div className="text-center d-flex flex-column">
                            <div>
                                <img src={API_BASE_URL+circuitItem.image} alt={circuitItem.name} className="w-75" />
                            </div>
                            <div className='mt-4'>
                                <Chip
                                    color='primary'
                                    style={{ backgroundColor: '#212529' }}
                                    label={
                                        <>
                                            <span>
                                                <FontAwesomeIcon icon={faFlagCheckered} style={{ fontSize: '20px', marginRight: 4 }} />
                                            </span> 
                                            {circuitItem.laps} laps ({((circuitItem.meters / 1000) * circuitItem.laps).toFixed(2)}km)
                                        </>
                                    }
                                />
                            </div>

                        </div>
                        <div className="mt-4">
                            <h3 style={{fontWeight:'bold'}}>Specifications</h3>
                            <Grid spacing={2} container>
                                <Grid container item xs={6}>
                                    <div>
                                        <h4>
                                            City
                                        </h4>
                                        <p>{circuitItem.city}</p>
                                    </div>
                                </Grid>
                                <Grid container item md={6}>
                                    <div>
                                        <h4>
                                            Total fast corners
                                        </h4>
                                        <p>{circuitItem.fastCurves}</p>
                                    </div>
                                </Grid>
                                <Grid container item xs={6}>
                                    <div>
                                        <h4>
                                            Total medium corners
                                        </h4>
                                        <p>{circuitItem.mediumCurves}</p>
                                    </div>
                                </Grid>
                                <Grid container item xs={6}>
                                    <div>
                                        <h4>
                                            Total slow corners
                                        </h4>
                                        <p>{circuitItem.slowCurves}</p>
                                    </div>
                                </Grid>
                                <Grid container item xs={6}>
                                    <div>
                                        <h4>
                                            Laps
                                        </h4>
                                        <p>{circuitItem.laps}</p>
                                    </div>
                                </Grid>
                                <Grid container item xs={6}>
                                    <div>
                                        <h4>
                                            Track length
                                        </h4>
                                        <p>{circuitItem.meters}m</p>
                                    </div>
                                </Grid>

                            </Grid>
                        </div>
                    </CardBody>
                </Card>
            )}
        </>
    )
}

export default CircuitCard;

