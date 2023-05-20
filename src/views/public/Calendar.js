import React, { useState, useEffect } from "react";
import EventsCalendar from "components/Calendar/EventsCalendar";
import {
  Container,
  Card,
  CardBody,
} from "reactstrap";

const Calendar = () => {

  return (
    <Container className="mb-4 mt--4 mt-md--6" fluid>
      <Card className="shadow mb-4" style={{height:'70vh', zIndex:0}}>
        <CardBody>
          <EventsCalendar/>
        </CardBody>
      </Card>
    </Container>
  );
};

export default Calendar;
