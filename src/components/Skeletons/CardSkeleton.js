import React from "react";
import { Skeleton } from "@mui/material";
import { Card, CardHeader, CardBody } from "reactstrap";

//Create card skeleton component using material ui skeleton
export default function CardSkeleton(props) {
    const { loading, cardNum } = props;
    return (
        <>
            {loading && [...Array(cardNum ? cardNum : 4)].map((e, i) => (
                <Card className="shadow mb-4" style={{ flexBasis: '49%' }} key={i}>
                    <CardHeader>
                        <Skeleton animation="wave" height={30} width="100%" />
                    </CardHeader>
                    <CardBody>
                        <Skeleton animation="wave" variant="rounded" width="100%" height={400} />
                    </CardBody>
                </Card>
            ))}
        </>
    )
}
