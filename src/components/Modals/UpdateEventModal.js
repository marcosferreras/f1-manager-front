import React, { useState, useEffect } from 'react';
import DialogContentText from '@mui/material/DialogContentText';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CircleIcon from '@mui/icons-material/Circle';
import SyncIcon from '@mui/icons-material/Sync';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    MenuItem,
    Select,
    Dialog,
    TextField,
    DialogActions,
    DialogContent,
    Button,
    Stack,
    DialogTitle,
    InputLabel,
    FormControl,
} from '@mui/material';
import { useSnackbar } from "notistack";
import { API_URL_CONSTANTS } from 'constants';
import axios from 'axios';

export default function UpdateEventModal(props) {
    const { handleClose, openModal, eventData } = props;
    const [startAt, setStartAt] = useState('');
    const [endAt, setEndAt] = useState('');
    const [circuitId, setCircuitId] = useState(1);
    const [eventId, setEventId] = useState(0);
    const [eventColor, setEventColor] = useState('');
    const [summary, setSummary] = useState('');
    const [availableCircuits, setAvailableCircuits] = useState([]);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (eventData && openModal) {
            setStartAt(dayjs(eventData.startAt));
            setEndAt(dayjs(eventData.endAt));
            if(eventData.circuit){
                setCircuitId(eventData.circuit.id);
            }
            setEventColor(eventData.color);
            setSummary(eventData.originalSummary ? eventData.originalSummary : eventData.summary);
            setEventId(eventData.id);
            loadCircuitList();
        }
    }, [openModal]);

    const loadCircuitList = async () => {
        const response = await axios.get(API_URL_CONSTANTS.API_CIRCUITS_URL);
        if (response.status === 200) {
            setAvailableCircuits(response.data.content);
        }
    };

    const handleUpdateEvent = async () => {
        if (summary && circuitId && startAt && endAt && eventColor) {
            const response = await axios.put(API_URL_CONSTANTS.API_EVENTS_URL + "/" + eventId, {
                summary,
                circuitId,
                color: eventColor,
                startAt,
                endAt,
                id: eventId,
            });
            if (response.status === 200) {
                //Notistack
                enqueueSnackbar('Event updated succesfully', { variant: 'success' });
            } else {
                enqueueSnackbar('Server error, please try again', { variant: 'error' });
            }
            handleClose();
        } else {
            enqueueSnackbar('Please fill all the fields', { variant: 'error' });
        }
    };

    const handleDeleteEvent = async () => {
        if (eventId) {
            const response = await axios.delete(`${API_URL_CONSTANTS.API_EVENTS_URL}/${eventId}`);
            if (response.status === 200) {
                //Notistack
                enqueueSnackbar('Event deleted succesfully', { variant: 'success' });
            } else {
                enqueueSnackbar('Server error, please try again', { variant: 'error' });
            }
            handleClose();
        } else {
            enqueueSnackbar('Functional error', { variant: 'error' });
        }
    };


    return (
        <div>
            <Dialog open={openModal} onClose={handleClose} fullWidth>
                <DialogTitle>Modify event</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Fill the following fields.
                    </DialogContentText>
                    <Stack spacing={3}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Event name"
                                type="text"
                                fullWidth
                                variant="outlined"
                                required
                                value={summary}
                                onChange={(evt) => setSummary(evt.target.value)}
                            />
                            <FormControl fullWidth>
                                <InputLabel id="select-circuit-label">Circuit</InputLabel>
                                <Select
                                    defaultValue={'blue'}
                                    label="Event color"
                                    labelId="select-circuit-label"
                                    id="demo-simple-select"
                                    value={circuitId}
                                    required
                                    onChange={(evt) => setCircuitId(evt.target.value)}
                                >
                                    {Array.isArray(availableCircuits) && availableCircuits.map((circuit, index) => (
                                        <MenuItem value={circuit.id} key={index}>
                                            {circuit.city}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <DateTimePicker
                                label="Start event at"
                                ampm={false}
                                value={startAt}
                                inputFormat="DD/MM/YYYY HH:mm"
                                onChange={(newValue) => setStartAt(newValue)}
                                renderInput={(params) => <TextField {...params} />}
                            />
                            <DateTimePicker
                                label="End event at"
                                ampm={false}
                                value={endAt}
                                inputFormat="DD/MM/YYYY HH:mm"
                                onChange={(newValue) => setEndAt(newValue)}
                                renderInput={(params) => <TextField {...params} />}
                            />
                            <FormControl fullWidth>
                                <InputLabel id="select-event-color-label">Event color</InputLabel>
                                <Select
                                    label="Event color"
                                    labelId="select-event-color-label"
                                    id="demo-simple-select"
                                    value={eventColor}
                                    required
                                    onChange={(evt) => setEventColor(evt.target.value)}
                                >
                                    <MenuItem value={'blue'}>
                                        <CircleIcon sx={{ color: 'rgb(30, 136, 229)' }} /> Blue
                                    </MenuItem>
                                    <MenuItem value={'red'}>
                                        <CircleIcon sx={{ color: 'rgb(229, 57, 53)' }} /> Red
                                    </MenuItem>
                                    <MenuItem value={'orange'}>
                                        <CircleIcon sx={{ color: 'rgb(251, 140, 0)' }} /> Orange
                                    </MenuItem>
                                    <MenuItem value={'green'}>
                                        <CircleIcon sx={{ color: 'rgb(67, 160, 71)' }} /> Green
                                    </MenuItem>
                                    <MenuItem value={'black'}>
                                        <CircleIcon sx={{ color: 'black' }} /> Black
                                    </MenuItem>
                                    <MenuItem value={'indigo'}>
                                        <CircleIcon sx={{ color: 'indigo' }} /> Purple
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </LocalizationProvider>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteEvent} sx={{ color: 'primary.dark' }}>
                        <DeleteIcon /> Delete
                    </Button>
                    <Button onClick={handleUpdateEvent} variant="contained">
                        <SyncIcon /> Update
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}