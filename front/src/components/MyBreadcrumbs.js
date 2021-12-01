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
    const url = window.location.href;
    const flightCode = url.substring(url.lastIndexOf('/') + 1);

    if (props.activeViewFlight)
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

    if (props.activeDetails)
        return (
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" className={classes.faded} />} aria-label="breadcrumb">
                <Typography>
                    <Link href="/" className={classes.faded}>
                        Browse Flights
                    </Link>
                </Typography>
                <Typography>
                    <Link href={`/view/${flightCode}`} className={classes.faded}>
                        View Flight
                    </Link>
                </Typography>
                <Typography className={classes.prText}>Order Details</Typography>
            </Breadcrumbs>
        )
    
    if (props.activeChoosePM)
        return (
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" className={classes.faded} />} aria-label="breadcrumb">
                <Typography>
                    <Link href="/" className={classes.faded}>
                        Browse Flights
                    </Link>
                </Typography>
                <Typography>
                    <Link href={`/view/${flightCode}`} className={classes.faded}>
                        View Flight
                    </Link>
                </Typography>
                <Typography>
                    <Link
                        href={`/buy/${flightCode}`}
                        className={classes.faded}
                        onClick={
                            (e) => {
                                e.preventDefault();
                                props.setActiveDetails(true)
                                props.setActiveChoosePM(false)
                                props.setActiveCheckout(false)
                            }
                        }
                    >
                        Order Details
                    </Link>
                </Typography>
                <Typography className={classes.prText}>Choose Payment Method</Typography>
            </Breadcrumbs>
        )

    if (props.activeCheckout) {
        return (
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" className={classes.faded} />} aria-label="breadcrumb">
                <Typography>
                    <Link href="/" className={classes.faded}>
                        Browse Flights
                    </Link>
                </Typography>
                <Typography>
                    <Link href={`/view/${flightCode}`} className={classes.faded}>
                        View Flight
                    </Link>
                </Typography>
                <Typography>
                    <Link
                        href={`/buy/${flightCode}`}
                        className={classes.faded}
                        onClick={
                            (e) => {
                                e.preventDefault();
                                props.setActiveDetails(true)
                                props.setActiveChoosePM(false)
                                props.setActiveCheckout(false)
                            }
                        }
                    >
                        Order Details
                    </Link>
                </Typography>
                <Typography>
                    <Link
                        href={`/buy/${flightCode}`}
                        className={classes.faded}
                        onClick={
                            (e) => {
                                e.preventDefault();
                                props.setActiveDetails(false)
                                props.setActiveChoosePM(true)
                                props.setActiveCheckout(false)
                            }
                        }
                    >
                        Choose Payment Method
                    </Link>
                </Typography>
                <Typography className={classes.prText}>Checkout</Typography>
            </Breadcrumbs>
        )
    }
}

export default MyBreadcrumbs;