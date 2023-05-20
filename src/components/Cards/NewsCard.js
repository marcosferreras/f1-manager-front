import { Grid } from '@mui/material';
import { Card, CardHeader, CardBody, Row } from "reactstrap";
import { API_BASE_URL } from 'constants';
import { Chip } from '@mui/material';

const NewsCard = (props) => {
    const { newItem } = props;
    return (
        <>
            {newItem && (
                <Card className="shadow" style={{ flexBasis: '40%' }}>
                    <CardHeader className="border-0">
                        <Row className="align-items-center">
                                <h2 className="mb-0" style={{fontWeight:'bold'}} href={newItem.link}>{newItem.title} {
                                    <Chip
                                        label={"Open Link"}
                                        key={newItem.title}
                                        onClick={() => window.open(newItem.link, "_blank")}
                                    />
                                }</h2>
                        </Row>
                    </CardHeader>
                    <CardBody>
                        <div className="text-center d-flex flex-column">
                            <div>
                                {newItem.image && (
                                    <img src={API_BASE_URL+newItem.image} alt={newItem.title} className="w-75" />
                                )}
                            </div>
                        </div>
                        <div className="mt-4">
                            <Grid spacing={2} container>
                                <Grid container item xs={12}>
                                        <p style={{
                                            whiteSpace: "pre-wrap",
                                            ovverflow: "hidden",
                                            textOverflow: "ellipsis",
                                            textAlign: "justify",
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: "vertical"
                                            
                                        }}>{newItem.text}</p>
                                </Grid>
                                
                            </Grid>
                        </div>
                    </CardBody>
                </Card>
            )}
        </>
    )
}

export default NewsCard;

