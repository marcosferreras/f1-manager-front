import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import Chip from '@mui/material/Chip';
import { Stack } from "@mui/system";
import { Avatar } from '@mui/material';
import ReactCountryFlag from "react-country-flag";
import { Button, Card, CardHeader, CardBody, Row } from "reactstrap";
import { API_BASE_URL, TWITTER_BASE_URL } from 'constants';
const clm = require('country-locale-map');

const TeamCard = (props) => {
    const { teamItem } = props;
    return (
        <>
            {teamItem && (
                <Card className="shadow mb-4" style={{ flexBasis: '49%' }}>
                    <CardHeader className="border-0">
                        <Row className="align-items-center">
                            <div className="col">
                                <h2 className="mb-0">{teamItem.name}</h2>
                            </div>
                            <div className="col text-right">
                                <Button
                                    style={{ backgroundColor: "#1DA1F2", borderColor: "#1DA1F2", color: "#FFFFFF" }}
                                    onClick={() => window.open(TWITTER_BASE_URL + "/" + teamItem.twitter, "_blank")}
                                    size="sm"
                                >
                                    <span>Ir a twitter</span>
                                    <FontAwesomeIcon icon={faTwitter} />
                                </Button>
                            </div>
                        </Row>
                    </CardHeader>
                    <CardBody className='d-flex flex-column'>
                        <div className="row flex-grow-1">
                            <div className="text-center col d-flex align-items-center justify-content-center">
                                <img src={API_BASE_URL + teamItem.logo} alt={teamItem.name} className="w-75" />
                            </div>
                        </div>
                        <div className="row">
                            {Array.isArray(teamItem.drivers) && teamItem.drivers.length > 0 && (
                                <div className="mt-4 col">
                                    <h3>Drivers</h3>
                                    <Stack direction={'row'} spacing={0} sx={{ flexWrap: 'wrap', gap: 1, marginTop: 2, justifyContent: 'space-around' }}>
                                        {teamItem.drivers.map((driver, index) => (
                                            <div className="d-flex flex-column align-items-center mb-3" key={index}>
                                                <Avatar
                                                    src={API_BASE_URL + driver.image}
                                                    sx={{ width: 80, height: 80, marginBottom: 1 }}
                                                    alt={driver.name}
                                                />
                                                <h2>
                                                    <span> <ReactCountryFlag countryCode={clm.getAlpha2ByName(driver.country)} /> </span>
                                                    <span className="font-italic">{`${driver.acronym} ${driver.number}`}</span>
                                                </h2>
                                                <Chip
                                                    icon={<FontAwesomeIcon icon={faTwitter} style={{ color: "#1DA1F2" }} />}
                                                    label={`${driver.name} ${driver.lastName}`}
                                                    key={index}
                                                    onClick={() => window.open(TWITTER_BASE_URL + "/" + driver.twitter, "_blank")}
                                                />
                                            </div>
                                        ))}
                                    </Stack>
                                </div>)}
                        </div>
                    </CardBody>
                </Card>
            )}
        </>
    )
}

export default TeamCard;

