import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Chip from '@mui/material/Chip';
import { Grid } from '@mui/material';
import { Card, CardHeader, CardBody, Row } from "reactstrap";
import { faGasPump } from '@fortawesome/free-solid-svg-icons';
import F1CarIcon from 'components/Icons/F1CarIcon';
import { API_BASE_URL } from 'constants';

const CarCard = (props) => {
    const { carItem } = props;
    return (
        <>
            {carItem && (
                <Card className="shadow" style={{ flexBasis: '40%' }}>
                    <CardHeader className="border-0">
                        <Row className="align-items-center">
                            <div className="col">
                                <h2 className="mb-0" style={{fontWeight:'bold'}}>{carItem.name}</h2>
                            </div>
                        </Row>
                    </CardHeader>
                    <CardBody>
                        <div className="text-center d-flex flex-column">
                            <div>
                                {carItem.teamDto && carItem.teamDto.logo && (
                                    <img src={API_BASE_URL + carItem.teamDto.logo} alt={carItem.teamDto.logo} className="w-75" />
                                )}
                            </div>
                            <div>
                                <Chip
                                    color='primary'
                                    style={{ backgroundColor: '#212529' }}
                                    label={<><F1CarIcon sx={{fontSize:'50px'}}/> <span>{carItem.code}</span></>}
                                />
                            </div>

                        </div>
                        <div className="mt-4">
                            <h3 style={{fontWeight:'bold'}}>Specifications</h3>
                            <Grid spacing={2} container>
                                <Grid container item xs={6}>
                                    <div>
                                        <h4>
                                            ERS Fast Corner
                                        </h4>
                                        <p>{carItem.ers_FastCurve}</p>
                                    </div>
                                </Grid>
                                <Grid container item md={6}>
                                    <div>
                                        <h4>
                                            ERS Medium Corner
                                        </h4>
                                        <p>{carItem.ers_MediumCurve}</p>
                                    </div>
                                </Grid>
                                <Grid container item xs={6}>
                                    <div>
                                        <h4>
                                            ERS Slow Corner
                                        </h4>
                                        <p>{carItem.ers_SlowCurve}</p>
                                    </div>
                                </Grid>
                                <Grid container item xs={6}>
                                    <div>
                                        <h4>
                                            <FontAwesomeIcon className='mr-1' icon={faGasPump} />
                                            Fuel consumption
                                        </h4>

                                        <p className='inline'>{carItem.consumption} l/100km </p>
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

export default CarCard;

