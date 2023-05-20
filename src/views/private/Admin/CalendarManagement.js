import { useState } from "react";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import EventsCalendar from "components/Calendar/EventsCalendar";

const CalendarManagement = () => {

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow" style={{ height: '80vh', zIndex: 0 }}>
              <CardHeader className="bg-transparent">
                <h3 className="mb-0">Calendar</h3>
              </CardHeader>
              <CardBody>
                <EventsCalendar allowCreateEvent />
              </CardBody>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default CalendarManagement;

