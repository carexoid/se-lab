import { Paper, TextField, Typography, Box, Button } from '@material-ui/core';
import PaymentIcon from '@material-ui/icons/Payment';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@mui/material';
import React, { useState, useEffect } from 'react';
import MyBreadcrumbs from '../components/MyBreadcrumbs';
import $ from "jquery";


const useStyles = makeStyles((theme) => ({
    paper: {
        backgroundColor: theme.palette.papers.main,
        padding: theme.spacing(2),
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(2),
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '65%',
    },
    box: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'left',
        textAlign: 'center',
    },
    spacing: {
        margin: theme.spacing(2),
    },
    horizontalSpacing: {
        marginRight: theme.spacing(3),
    },
    inputLong: {
        width: 150,
    },
    note: {
        color: theme.palette.fadedtext.main,
        fontSize: 10,
    },
    button: {
        width: 200,
    },
}));

function parseDetails(url) {
    const param = url.substring(url.indexOf('?') + 1);
    const pairs = param.split('?');
    let values = {};
    pairs.forEach((pair) => {
        const [name, value] = pair.split('=')
        values = {
            ...values,
            [name]: value
        }
    })

    return values;
}

function BonusCheckout() {
    const classes = useStyles();
    const [bonus, setBonus] = useState(0);
    const [order, setOrder] = useState(parseDetails(window.location.href))
    const [backUserInfo, setBackUserInfo] = useState({
        bonuses: 0,
        user_id: 1
    })
    const [tickets, setTickets] = useState({
        econom: [],
        business: [],
    })

    useEffect(() => {
        console.log(order)

        $.ajax({
            type: 'GET',
            url: 'api/chief/account',
            //TODO add Authorization header
            headers: { 'Accept': 'application/json' },
            success: ((responseJSON) => {
                setBackUserInfo(responseJSON)
            })
        })

        $.ajax({
            type: 'GET',
            url: `/api/chief/flights/${order.flightId}/tickets`,
            headers: { 'Accept': 'application/json' },
            success: ((responseJSON) => {
                setTickets(responseJSON)
            })
        })

    }, [])

    useEffect(() => {
        const newCost = +(order.quantity) * +(order.price) - bonus
        if (newCost < 1) {
            const possibleBonuses = +(order.quantity) * +(order.price) - 1
            setBonus(possibleBonuses)
        }
    }, [bonus])

    const composeOrder = () => {
        let ticketsField = tickets[order.class].slice(0, order.quantity).map(x => {
            return {
                flight_id: order.flightId,
                seat: x.seat,
            }
        })

        const body = {
            tickets: ticketsField,
            use_bonuses: bonus
        }

        console.log('body: ', body)

        return encodeURIComponent(JSON.stringify(body))
    }

    return (
        <div>
            <MyBreadcrumbs
                activeCheckout={true}
                flightId={+order.flightId}
            />

            <Paper className={classes.paper}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant='h2'>Use Bonuses</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography>You have {backUserInfo.bonuses} avalaible Bonuses</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Box className={classes.box}>
                            <Typography className={classes.horizontalSpacing}>Specify the amount to use:</Typography>
                            <TextField
                                value={bonus}
                                onChange={(e) => setBonus(e.target.value)}
                                type="number"
                                variant='outlined'
                                size="small"
                                className={classes.input}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    inputProps: {
                                        min: 0,
                                        max: backUserInfo.bonuses
                                    }
                                }}
                                defaultValue={0}
                            />
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography className={classes.note}>
                            * Note, that you can't cover the entire cost with Bonuses.
                            For legal reasons at least 1$ should be transactioned for purchase to be properly registered.
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>

            <Box textAlign='center' className={classes.spacing}>
                <form action={`/api/chief/crutched_booking?body=${composeOrder()}`} method='POST'>
                    <Button
                        color="primary"
                        size='large'
                        variant="contained"
                        type='submit'
                        startIcon={<PaymentIcon />}
                        className={classes.button}
                    >
                        Pay
                    </Button>
                </form>
            </Box>
        </div>
    );
}

export default BonusCheckout;