import React, { useEffect, useState } from 'react';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Link, Box, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Slider, Typography, } from '@material-ui/core';
import { Link as RLink } from 'react-router-dom';
import $, {ajax} from 'jquery';
import DisplayFlight from '../components/DisplayFlight';
import MyBreadcrumbs from '../components/MyBreadcrumbs';


const useStyles = makeStyles((theme) => ({
    containerBox: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(4),
    },
    spacing: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(3),
    },
    paper: {
        padding: theme.spacing(1),
        width: '10%',
        minWidth: 80,
        margin: theme.spacing(2),
    },
    paperEconom: {
        backgroundColor: '#3e83c6',
    },
    paperBusiness: {
        backgroundColor: '#0b367a',
    },
    lightText: {
        color: theme.palette.primary.contrastText,
        fontWeight: '900',
        lineHeight: '200%',
        textAlign: 'center'
    },
    box: {
        width: 300,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'left',
        //justifyContent: 'center',
    },
    button: {
        width: '29%',
        minWidth: 275,
    },
    faded: {
        backgroundColor: theme.palette.bg.main,
    },
    bold: {
        fontWeight: 700,
    },
}));

const emptyFlight = {
    airport_id: 0,
    airport_name: "",
    arrival_at: "",
    business_min_price: null,
    business_remaining: 0,
    city: "",
    departure_at: "",
    direction: 0,
    distance: 0,
    duration: 0,
    econom_min_price: null,
    econom_remaining: 0,
    id: 0
};

function ViewFlight() {
    const classes = useStyles();
    const [flight, setFlight] = useState(emptyFlight);

    useEffect(() => {
        const url = window.location.href;
        const flightCode = url.substring(url.lastIndexOf('/') + 1);

        $.ajax({
            type: 'GET',
            url: `/api/chief/flights/${flightCode}`,
            headers: { 'Accept': 'application/json' },
            success: (responseJSON) => {
                console.log(responseJSON)
                setFlight(responseJSON)
            }
        })
    },[])

    return (<div>
        <MyBreadcrumbs
            activeViewFlight={true}
            flightId={flight.id}
        />
        
        <Box
            className={classes.containerBox}
        >
            <Typography variant='h2' className={classes.spacing}>Kyiv — { flight.city }</Typography>
            
            <DisplayFlight flight={flight}/>

            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={2} lg={2}>
                    <Typography className={classes.bold}>Available Seats:</Typography>
                </Grid>

                <Grid item xs={12} sm={10} lg={10}>
                    <Box className={classes.box}>
                        <Paper
                            elevation={0}
                            className={`${flight.econom_remaining !==0 ? classes.paperEconom : classes.faded} ${classes.paper}`}
                        >
                            <Typography className={classes.lightText}>Econom</Typography>
                            <Typography className={classes.lightText}>{flight.econom_remaining}</Typography>
                            <Typography className={classes.lightText}>{flight.econom_remaining !== 0 ? `${flight.econom_min_price} $` : '—'}</Typography>
                        </Paper>

                        <Paper
                            elevation={0}
                            className={`${flight.business_remaining !== 0 ? classes.paperBusiness : classes.faded} ${classes.paper}`}
                        >
                            <Typography className={classes.lightText}>Business</Typography>
                            <Typography className={classes.lightText}>{flight.business_remaining}</Typography>
                            <Typography className={classes.lightText}>{flight.business_remaining !== 0 ? `${flight.business_min_price} $` : '—'}</Typography>
                        </Paper>

                    </Box>
                </Grid>

                <Grid item xs={12}>
                    <Box textAlign="center"> 
                        <Button
                            color='primary'
                            size='large'
                            variant="contained"
                            className={classes.button}
                            component={RLink} to={`/place_order/${flight.id}`}
                        >
                            Buy Tickets
                        </Button>
                    </Box>
                </Grid>

            </Grid>
        </Box>
    </div> );
}

export default ViewFlight;