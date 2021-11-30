import React from 'react';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Link, Box, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Slider, Typography, } from '@material-ui/core';
import $ from 'jquery';

const useStyles = makeStyles((theme) => ({
    faded: {
        color: theme.palette.fadedtext.main,
    },
    containerBox: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(1),
        width: '10%',
        minWidth: 80,
        margin: theme.spacing(5),
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
    },
    box: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
    },
    button: {
        width: '29%',
        minWidth: 275,
    },
    prText: {
        color: theme.palette.primary.main,
    }
}));

function handleClick(event) {
    /* event.preventDefault();
    console.info('You clicked a breadcrumb.'); */
}

function ViewFlight() {
    const url = window.location.href;
    const flightCode = url.substring(url.lastIndexOf('/') + 1);
    //const theme = useTheme();
    const classes = useStyles();

    //TODO fetch info about flight
    const flight = {
        id: 'KPNL145',
        destination: 'London',
        business_remaining: 1,
        econom_remaining: 1,
    };

    return (<div>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" className={classes.faded}/>} aria-label="breadcrumb">
            <Typography>
                <Link href="/" onClick={handleClick} className={classes.faded}>
                    Browse Flights
                </Link>
            </Typography>
            <Typography className={classes.prText}>View Flight</Typography>
        </Breadcrumbs>
        
        <Box
            className={classes.containerBox}
        >
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
                    <Typography variant='h2'>{flightCode}</Typography>
                </Grid>

                <Grid item xs={12} sm={2} lg={2}>
                    <Typography >Destination:</Typography>
                </Grid>
                <Grid item xs={12} sm={10} lg={10}>
                    <Typography >{flight.destination}</Typography>
                </Grid>

                <Grid item xs={12} sm={2} lg={2}>
                    <Typography >Blah:</Typography>
                </Grid>
                <Grid item xs={12} sm={10} lg={10}>
                    <Typography >blah</Typography>
                </Grid>

                {/* 
                    TODO gray out Paper if 0 seats avalaible 
                    eg:  
                        className={`banner large ${active ? "active" : ""} ${disabled ? "disabled" : ""}`}
                */}
                <Grid item xs={12}>
                    <Box className={classes.box}>
                        <Paper
                            elevation={0}
                            className={`${classes.paperEconom} ${classes.paper}`}
                        >
                            <Typography className={classes.lightText}>Econom</Typography>
                            <Typography
                                style={{ textAlign: 'center' }}
                                className={classes.lightText}
                            >
                                {flight.econom_remaining}
                            </Typography>
                        </Paper>

                        <Paper elevation={0} className={`${classes.paperBusiness} ${classes.paper}`}>
                            <Typography className={classes.lightText}>Business</Typography>
                            <Typography
                                style={{ textAlign: 'center' }}
                                className={classes.lightText}
                            >
                                {flight.business_remaining}
                            </Typography>
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