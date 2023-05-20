import React, { useState, useEffect } from 'react';
import DialogContentText from '@mui/material/DialogContentText';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CircleIcon from '@mui/icons-material/Circle';
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

export default function NewEventModal(props) {
    const { handleClose, openModal, eventData } = props;
    const [startAt, setStartAt] = useState(null);
    const [endAt, setEndAt] = useState(null);
    const [circuitId, setCircuitId] = useState(1);
    const [availableCircuits, setAvailableCircuits] = useState([]);
    const [eventColor, setEventColor] = useState('blue');
    const [summary, setSummary] = useState();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (openModal) {
            setStartAt(eventData ? dayjs(eventData.startAt) : null);
            setEndAt(eventData ? dayjs(eventData.endAt) : null);
            loadCircuitList();
        }
    }, [openModal]);

    const loadCircuitList = async () => {
        const response = await axios.get(API_URL_CONSTANTS.API_CIRCUITS_URL);
        if (response.status === 200) {
            setAvailableCircuits(response.data.content);
        }
    };

    const handleCreateEvent = async () => {
        if (summary && circuitId && startAt && endAt && eventColor) {
            const response = await axios.post(API_URL_CONSTANTS.API_EVENTS_URL, {
                summary,
                circuitId,
                color: eventColor,
                startAt,
                endAt
            });
            if (response.status === 200) {
                //Notistack
                enqueueSnackbar('Event created succesfully', { variant: 'success' });
            } else {
                enqueueSnackbar('Something went wrong', { variant: 'error' });
            }
            handleClose();
        } else {
            enqueueSnackbar('Please fill all the fields', { variant: 'error' });
        }
    };

    return (
        <div>
            <Dialog open={openModal} onClose={handleClose} fullWidth>
                <DialogTitle>Add new event to the calendar</DialogTitle>
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
                    <Button onClick={handleCreateEvent}>Add event to calendar</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}