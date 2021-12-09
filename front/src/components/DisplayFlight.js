import { Grid, Typography } from '@material-ui/core';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    bold: {
        fontWeight: 700,
    },
}));

function getHours(s) {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s - h * 3600) / 60)
    return h.toString() + ':' + m.toString().padStart(2, '0')
}

function DisplayFlight(props) {
    const classes = useStyles();
    return (
        <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={2} lg={2}>
                <Typography className={classes.bold}>Code:</Typography>
            </Grid>
            <Grid item xs={12} sm={10} lg={10}>
                <Typography >{props.flight.id.toString().padStart(5,'0')}</Typography>
            </Grid>

            <Grid item xs={12} sm={2} lg={2}>
                <Typography className={classes.bold}>To Airport:</Typography>
            </Grid>
            <Grid item xs={12} sm={10} lg={10}>
                <Typography >{props.flight.airport_name}</Typography>
            </Grid>

            <Grid item xs={12} sm={2} lg={2}>
                <Typography className={classes.bold}>Departure:</Typography>
            </Grid>
            <Grid item xs={12} sm={10} lg={10}>
                <Typography >{props.flight.departure_at}</Typography>
            </Grid>

            <Grid item xs={12} sm={2} lg={2}>
                <Typography className={classes.bold}>Arrival:</Typography>
            </Grid>
            <Grid item xs={12} sm={10} lg={10}>
                <Typography >{props.flight.arrival_at}</Typography>
            </Grid>

            {typeof props.flight.duration !== 'undefined' &&
                <Grid item xs={12} sm={2} lg={2}>
                    <Typography className={classes.bold}>Duration:</Typography>
                </Grid>                   
            }

            {typeof props.flight.duration !== 'undefined' &&
                <Grid item xs={12} sm={10} lg={10}>
                    <Typography >{getHours(props.flight.duration)} h</Typography>
                </Grid>
            }

            <Grid item xs={12} sm={2} lg={2}>
                <Typography className={classes.bold}>Distance:</Typography>
            </Grid>
            <Grid item xs={12} sm={10} lg={10}>
                <Typography >{props.flight.distance} km</Typography>
            </Grid>
        </Grid>
    );
}

export default DisplayFlight;