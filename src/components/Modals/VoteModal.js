import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import { API_URL_CONSTANTS } from "constants";
import { Stack } from '@mui/system';
import { useSnackbar } from "notistack";
import { Box, FormControl } from '@mui/material';

export default function VoteModal(props) {
    const { handleClose, openModal, surveyData } = props;
    const [email, setEmail] = useState();
    const [name, setName] = useState();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (openModal) {
            setEmail("");
            setName("");
        }
    }, [openModal]);

    const handleSubmitVote = (e) => {
        e.preventDefault();
        if (name && email) {
            //axios call to send the vote
            axios.post(API_URL_CONSTANTS.API_SURVEYS_URL + `/${surveyData.surveyId}/add-vote`, {
                email,
                driverId: surveyData.driver.id,
                name
            }).then((response) => {
                if (response.status === 200) {
                    enqueueSnackbar("Vote sent successfully", { variant: "success" });
                } else if (response.status === 400) {
                    enqueueSnackbar("You have already voted in this survey", { variant: "error" });
                }
                handleClose();
            })
        } else {
            enqueueSnackbar("Please fill all the fields", { variant: "error" });
        }
    };

    return (
        <div>
            {surveyData && (
                <Dialog open={openModal} onClose={handleClose}>
                    <Box component="form" onSubmit={handleSubmitVote} sx={{ mt: 1 }}>
                        <DialogTitle>Vote for {surveyData.driver.name}</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Remember you only can vote one time per week.
                            </DialogContentText>
                            <Stack spacing={2}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    label="Name"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    required
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <TextField
                                    margin="dense"
                                    id="name"
                                    label="Email Address"
                                    type="email"
                                    fullWidth
                                    variant="outlined"
                                    required
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Stack>
                        </DialogContent>
                        <DialogActions>
                            <Button type='submit'>Vote</Button>
                        </DialogActions>
                    </Box>
                </Dialog>)
            }
        </div >
    );
}