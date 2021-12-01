import { Grid, Typography } from '@mui/material';
import React from 'react';

function DisplayFlight(props) {
    return (
        <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={2} lg={2}>
                <Typography >Destination:</Typography>
            </Grid>
            <Grid item xs={12} sm={10} lg={10}>
                <Typography >{props.flight.destination}</Typography>
            </Grid>

            <Grid item xs={12} sm={2} lg={2}>
                <Typography >Blah:</Typography>
            </Grid>
            <Grid item xs={12} sm={10} lg={10}>
                <Typography >blah</Typography>
            </Grid>
        </Grid>
    );
}

export default DisplayFlight;