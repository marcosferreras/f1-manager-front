import React, { useState, useEffect } from 'react';
import {
    Button
  } from "reactstrap";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Stack } from '@mui/system';
import { Box } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';

export default function DeleteItemModal(props) {
    const { handleClose, handleSubmit, openModal, item } = props;

    return (
        <div>
            {item && item.name && item.type && (
                <Dialog open={openModal} onClose={handleClose}>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <DialogTitle>Delete {item.name}</DialogTitle>
                        <DialogContent>
                            <Stack spacing={2}>
                                <h3>Are you sure you want to delete this {item.type}?</h3>
                            </Stack>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                color="primary"
                                onClick={handleClose}
                                size="m"
                            >
                                <FontAwesomeIcon icon={faXmark} /> Cancel
                            </Button>
                            <Button
                                color="default"
                                onClick={handleSubmit}
                                size="m"
                            >
                                <FontAwesomeIcon icon={faCheck} /> Delete
                            </Button>
                        </DialogActions>
                    </Box>
                </Dialog>)
            }
        </div >
    );
}