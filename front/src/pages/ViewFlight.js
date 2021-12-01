import React from 'react';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Link, Box, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Slider, Typography, } from '@material-ui/core';
import { Link as RLink } from 'react-router-dom';
import $ from 'jquery';
import DisplayFlight from '../components/DisplayFlight';
import MyBreadcrumbs from '../components/MyBreadcrumbs';

const useStyles = makeStyles((theme) => ({
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
        <MyBreadcrumbs
            activeViewFlight={true}
        />
        
        <Box
            className={classes.containerBox}
        >
            <Typography variant='h2'>{flightCode}</Typography>
            
            <DisplayFlight flight={flight}/>

            <Grid container spacing={2} alignItems="center">
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
                            square
                        >
                            <Typography className={classes.lightText}>Econom</Typography>
                            <Typography
                                style={{ textAlign: 'center' }}
                                className={classes.lightText}
                            >
                                {flight.econom_remaining}
                            </Typography>
                        </Paper>

                        <Paper
                            elevation={0}
                            className={`${classes.paperBusiness} ${classes.paper}`}
                            square
                        >
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
                            component={RLink} to={`/buy/${flight.id}`}
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