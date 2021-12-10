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
    redText: {
        color: theme.palette.secondary.main,
    },
}));

function OrderDetails(props) {
    const classes = useStyles();
    
    const calculateCost = () => {
        const price = props.order.class === 'econom' ? props.flight.econom_min_price : props.flight.business_min_price
        return props.order.quantity * price
    }
    
    const [cost, setCost] = useState(calculateCost());
    const [error, setError] = useState(false)

    useEffect(() => {
        props.setOrder('quantity', 1)
        console.log(props.flight)
        console.log(props.order)
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
    }, [props.order.class])

    const validateQuantity= () =>{
        if (props.order.quantity < 1)
            setError(true)
        else
            if (props.order.class == 'econom' && props.order.quantity > props.flight.econom_remaining)
                setError(true)
            else
                if (props.order.class == 'business' && props.order.quantity > props.flight.business_remaining)
                    setError(true)
                else
                    setError(false)
    }

    useEffect(() => {
        validateQuantity()
    }, [props.order.quantity])

    useEffect(() => {
        setCost(calculateCost())
        props.composeOrder()
        console.log(props.order)
    }, [props.order])

    return (
        <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={2}>
                <Typography>Choose Class<span className={classes.redText}>*</span>:</Typography>
            </Grid>
            <Grid item xs={12} md={10}>
                <Box className={`${classes.box} ${classes.input}`}>
                    <Paper
                        id='order-econom-class'
                        elevation={0}
                        className={`${classes.paper} ${props.order.class === 'econom' ? `${classes.paperEconom} ${classes.chosen}`: classes.faded}`}
                        onClick={() => {
                            if (props.flight.econom_remaining !== 0)
                                props.setOrder('class', 'econom')
                        }}
                    >
                        <Typography className={classes.lightText}>Econom</Typography>
                        <Typography className={classes.lightText}>{props.flight.econom_remaining}</Typography>
                        <Typography className={classes.lightText}>{props.flight.econom_remaining !== 0 ? `${props.flight.econom_min_price} $` : '—'}</Typography>
                    </Paper>

                    <Paper
                        id='order-business-class'
                        elevation={0}
                        className={`${classes.paper} ${props.order.class === 'business' ? `${classes.paperBusiness} ${classes.chosen}` : classes.faded}`}
                        onClick={() => {
                            if (props.flight.business_remaining !== 0)
                                props.setOrder('class', 'business')
                        }}
                    >
                        <Typography className={classes.lightText}>Business</Typography>
                        <Typography className={classes.lightText}>{props.flight.business_remaining}</Typography>
                        <Typography className={classes.lightText}>{props.flight.business_remaining !== 0 ? `${props.flight.business_min_price} $` : '—'}</Typography>
                    </Paper>
                </Box>
            </Grid>

            <Grid item xs={12} md={2}>
                <Typography>Quantity<span className={classes.redText}>*</span>:</Typography>
            </Grid>
            <Grid item xs={12} md={10}>
                <TextField
                    error={error}
                    InputProps={{
                        inputProps: {
                            min: 1,
                            max: props.order.class === 'econom' ? props.flight.econom_remaining : props.flight.business_remaining
                        }
                    }}
                    value={props.order.quantity}
                    onChange={(event) => {
                        props.setOrder('quantity', +event.target.value)
                    }}
                    className={classes.input}
                    id="order-quantity"
                    type="number"
                    variant='outlined'
                    size="small"
                    InputLabelProps={{
                        shrink: true,
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
                    id="order-comment"
                    multiline
                    rows={4}
                    placeholder="I'm allergic to peanut butter"
                    variant="outlined"
                    size="small"
                    onChange={(event) => {
                        props.setOrder('comment', event.target.value)
                    }}
                    InputProps={{
                        inputProps: {
                            maxLength: 1000,
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