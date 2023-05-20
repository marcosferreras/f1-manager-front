import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL_CONSTANTS } from "constants";
import Kalend, { CalendarView } from 'kalend' // import component
import 'kalend/dist/styles/index.css';
import './styles.css';
import {
  Container,
  Card,
  CardBody,
  Button
} from "reactstrap";
import NewEventModal from "components/Modals/NewEventModal";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import UpdateEventModal from "components/Modals/UpdateEventModal";

const EventsCalendar = (props) => {

  const { allowCreateEvent } = props;

  const [events, setEvents] = useState([
    {
      id: 1,
      startAt: '2022-12-08T19:00:00.000Z',
      endAt: '2022-12-08T22:00:00.000Z',
      summary: 'Monaco GP',
      color: 'blue',
      calendarID: 'work'
    },
    {
      id: 2,
      startAt: '2021-11-21T18:00:00.000Z',
      endAt: '2021-11-21T19:00:00.000Z',
      summary: 'test',
      color: 'blue'
    }
  ]);
  const [eventModalOpened, setEventModalOpened] = useState(false);
  const [updateEventModalOpened, setUpdateEventModalOpened] = useState(false);
  const [eventData, setEventData] = useState(null);

  const handleEventModalClose = () => {
    getEvents();
    setEventModalOpened(false);
  };

  const handleUpdateEventModalClose = () => {
    getEvents();
    setUpdateEventModalOpened(false);
  };

  const onNewEventClick = (data) => {
    // do something
    setEventData(data);
    setEventModalOpened(true);
  };

  const onExistingEventClick = (data) => {
    // do something
    setEventData(data);
    setUpdateEventModalOpened(true);
  };


  useEffect(() => {
    // Retrieve news from API
    getEvents();
  }, []);

  const getEvents = () => {
    axios.get(API_URL_CONSTANTS.API_EVENTS_URL).then((response) => {
      if (response) {
        let events = response.data.content;
        if(Array.isArray(events)){
          events = events.map(event => {
            event = {...event, originalSummary:event.summary}
            if(event.circuit){
              event = {...event, summary:event.summary + " - " + event.circuit.city}
            }
            return event;
          });
        }
        setEvents(events);
      }
    })
  }

  return (
    <>
      <div className="col text-left">
        {allowCreateEvent &&
          <Button
            color="primary"
            onClick={() => { onNewEventClick(null) }}
            size="sm"
          >
            <CalendarMonthIcon /> New event
          </Button>
        }
      </div>
      <Kalend
        onEventClick={allowCreateEvent ? onExistingEventClick : null}
        onNewEventClick={allowCreateEvent ? onNewEventClick : null}
        events={events}
        initialDate={new Date().toISOString()}
        hourHeight={60}
        initialView={CalendarView.WEEK}
        disabledViews={[CalendarView.DAY]}
        timeFormat={'24'}
        weekDayStart={'Monday'}
        autoScroll={true}
        showTimeLine={true}
        disabledDragging={true}
        language={'en'}
        colors={{
          light: {
            primaryColor: '#b20600'
          }
        }}
        className={{ 'Kalend__header_calendar_button-text-selected': 'color:#fffff' }}
      />
      <NewEventModal handleClose={handleEventModalClose} openModal={eventModalOpened} eventData={eventData} />
      <UpdateEventModal handleClose={handleUpdateEventModalClose} openModal={updateEventModalOpened} eventData={eventData} />
    </>

  );
};

export default EventsCalendar;
