import { Grid, Typography, TextField, Paper, Box } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    input: {
        width: 400,
    },
    lightText: {
        color: theme.palette.primary.contrastText,
        fontWeight: '900',
        lineHeight: '200%',
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
    faded: {
        backgroundColor: theme.palette.bg.main,
    },
    chosen: {
        border: `solid 2px ${theme.palette.bg.main}`
    },
    box: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
    },
    bigText: {
        fontSize: 24,
        fontWeight: 700,
    },
}));

function OrderDetails(props) {
    const classes = useStyles();
    const [tickets, setTickets] = useState({business:0, econom: 0});
    const [cost, setCost] = useState(0);

    useEffect(() => {
        //TODO fetch ticket prices on Mount
        // POTENTIALLY PASS AS PROP
        setTickets({
            business: 200,
            econom: 100,
        })

        setCost(tickets.econom)

    }, [])

    useEffect(() => {
        if (props.order.class === 'econom'
            && props.order.quantity > props.flight.econom_remaining
        )
            props.setOrder('quantity', props.flight.econom_remaining)
        if (props.order.class === 'business'
            && props.order.quantity > props.flight.business_remaining
        )
            props.setOrder('quantity', props.flight.business_remaining)
        console.log(props.order)
    }, [props.order.class])

    useEffect(() => {
        const price = props.order.class === 'econom' ? tickets.econom : tickets.business
        setCost(props.order.quantity * price)
    }, [props.order])

    return (
        <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={2}>
                <Typography>Choose Class:</Typography>
            </Grid>
            <Grid item xs={12} md={10}>
                <Box className={`${classes.box} ${classes.input}`}>
                    <Paper
                        elevation={0}
                        className={`${classes.paper} ${props.order.class === 'econom' ? `${classes.paperEconom} ${classes.chosen}`: classes.faded}`}
                        onClick={() => {
                            props.setOrder('class', 'econom')
                        }}
                    >
                        <Typography className={classes.lightText}>Econom</Typography>
                        <Typography
                            style={{ textAlign: 'center' }}
                            className={classes.lightText}
                        >
                            {props.flight.econom_remaining}
                        </Typography>
                    </Paper>

                    <Paper
                        elevation={0}
                        className={`${classes.paper} ${props.order.class === 'business' ? `${classes.paperBusiness} ${classes.chosen}` : classes.faded}`}
                        onClick={() => {
                            props.setOrder('class', 'business')
                        }}
                    >
                        <Typography className={classes.lightText}>Business</Typography>
                        <Typography
                            style={{ textAlign: 'center' }}
                            className={classes.lightText}
                        >
                            {props.flight.business_remaining}
                        </Typography>
                    </Paper>
                </Box>
            </Grid>

            <Grid item xs={12} md={2}>
                <Typography>Quantity:</Typography>
            </Grid>
            <Grid item xs={12} md={10}>
                <TextField
                    required
                    value={props.order.quantity}
                    onChange={(event) => {
                        props.setOrder('quantity', +event.target.value)
                    }}
                    className={classes.input}
                    id="quantity"
                    type="number"
                    variant='outlined'
                    size="small"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    InputProps={{
                        inputProps: {
                            min: 1,
                            max: props.order.class === 'econom' ? props.flight.econom_remaining : props.flight.business_remaining
                        }
                    }}

                />
            </Grid>

            <Grid item xs={12} md={2}>
                <Typography>Comment:</Typography>
            </Grid>
            <Grid item xs={12} md={10}>
                <TextField
                    value={props.order.comment}
                    className={classes.input}
                    id="comment"
                    multiline
                    rows={4}
                    placeholder="I'm allergic to peanut butter"
                    variant="outlined"
                    size="small"
                    onChange={(event) => {
                        props.setOrder('comment', event.target.value)
                        //console.log(props.order)
                    }}
                    InputProps={{
                        inputProps: {
                            maxlength: 1000,
                        }
                    }}
                />
            </Grid>

            <Grid item xs={12} md={2}>
                <Typography className={classes.bigText}>Total:</Typography>
            </Grid>
            <Grid item xs={12} md={10}>
                <Typography className={classes.bigText}>{cost} $</Typography>
            </Grid>
        </Grid>
     );
}

export default OrderDetails;