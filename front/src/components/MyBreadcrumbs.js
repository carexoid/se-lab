import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link, Breadcrumbs, Typography, } from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const useStyles = makeStyles((theme) => ({
    faded: {
        color: theme.palette.fadedtext.main,
    },
    prText: {
        color: theme.palette.primary.main,
    }
}));

// I'm sorry. it's trash, but null apparently is also considered as breadcrumb, I'm crying
function MyBreadcrumbs(props) {
    const classes = useStyles();
    /* const url = window.location.href;
    const flightCode = url.substring(url.lastIndexOf('/') + 1); */

    if (typeof props.activeViewFlight !== 'undefined')
        return (
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" className={classes.faded} />} aria-label="breadcrumb">
                <Typography>
                    <Link href="/" className={classes.faded}>
                        Browse Flights
                    </Link>
                </Typography>
                <Typography className={classes.prText}>View Flight</Typography>
            </Breadcrumbs>
        )

    if (typeof props.activeDetails !== 'undefined')
        return (
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" className={classes.faded} />} aria-label="breadcrumb">
                <Typography>
                    <Link href="/" className={classes.faded}>
                        Browse Flights
                    </Link>
                </Typography>
                <Typography>
                    <Link href={`/view/${props.flightId}`} className={classes.faded}>
                        View Flight
                    </Link>
                </Typography>
                <Typography className={classes.prText}>Order Details</Typography>
            </Breadcrumbs>
        )

    if (typeof props.activeCheckout !== 'undefined') {
        return (
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" className={classes.faded} />} aria-label="breadcrumb">
                <Typography>
                    <Link href="/" className={classes.faded}>
                        Browse Flights
                    </Link>
                </Typography>
                <Typography>
                    <Link href={`/view/${props.flightId}`} className={classes.faded}>
                        View Flight
                    </Link>
                </Typography>
                <Typography>
                    <Link
                        href={`/place_order/${props.flightId}`} className={classes.faded}
                    >
                        Order Details
                    </Link>
                </Typography>
                <Typography className={classes.prText}>Bonuses</Typography>
            </Breadcrumbs>
        )
    }
}

export default MyBreadcrumbs;