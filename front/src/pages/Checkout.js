import { Paper, TextField, Typography, Box, FormControl, Grid, MenuItem, Select, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useEffect } from 'react';
import BonusCheckout from './BonusCheckout';
import { Form, useForm } from '../components/useForm';
import MyBreadcrumbs from '../components/MyBreadcrumbs';
import PaymentIcon from '@material-ui/icons/Payment';
import { FormHelperText } from '@mui/material';

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
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(3),
    },
    horizontalSpacing: {
        marginRight: theme.spacing(1),
        marginLeft: theme.spacing(1),
    },
    inputLong: {
        width: 188,
    },
    inputShort: {
        width: 83,
    },
    note: {
        color: theme.palette.fadedtext.main,
        fontSize: 10,
    },
    breakText: {
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
        webkitHyphens: 'manual',
        mozHyphens: 'manual',
        msHyphens: 'manual',
        hyphens: 'manual',
    },
    button: {
        width: 200,
    },
    boldText: {
        fontWeight: 700,
        fontSize: 20,
    },
}));

const bonuses = 234;
const coef = 1;

function formatCardNumber(n) {
    //TODO
}

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

const emptyParams = {
    bonuses: 0,
    cardNumber: '',
    expMonth: '',
    expYear: '',
    cvv:'',
}

const emptyError = {
    cardNumber: '',
    expMonth: '',
    expYear: '',
    cvv: '',
}

function Checkout(props) {
    const classes = useStyles();
    const {
        values: payInfo,
        setValues: setPayInfo,
        handleInputChange,
        resetForm
    } = useForm(emptyParams);
    const [order, setOrder] = useState(parseDetails(window.location.href))
    const [cost, setCost] = useState(+(order.quantity) * +(order.price))
    const [errors, setErrors] = useState(emptyError)

    const validators = {
        cardNumber: () => {
            setErrors({
                ...errors,
                cardNumber: (/^\d{4} ?\d{4} ?\d{4} ?\d{4}$/).test(payInfo.cardNumber) ? "" : "Card Number is invalid",
            })
        },
        expMonth: () => {
            setErrors({
                ...errors,
                expMonth: payInfo.expMonth !== "" ? "" : "Required",
            })
        },
        expYear: () => {
            setErrors({
                ...errors,
                expYear: payInfo.expYear !== "" ? "" : "Required",
            })
        },
        cvv: () => {
            setErrors({
                ...errors,
                cvv: (/^\d{3}$/).test(payInfo.cvv) ? "" : "CVV is invalid",
            })
        },
    }


    useEffect(() => {
        console.log(order)
    }, [])

    useEffect(() => {
        console.log(errors)
    }, [errors])

    useEffect(() => {
        const newCost = +(order.quantity) * +(order.price) - payInfo.bonuses * coef
        if (newCost < 1) {
            const possibleBonuses = (+(order.quantity) * +(order.price) - 1) / coef
            setCost(1)
            setPayInfo({
                ...payInfo,
                bonuses: possibleBonuses
            })
        } else {
            setCost(newCost)
        }
    }, [payInfo.bonuses])

    useEffect(() => {
        validators.cardNumber()
    }, [payInfo.cardNumber])
    useEffect(() => {
        validators.expMonth()
    }, [payInfo.expMonth])
    useEffect(() => {
        validators.expYear()
    }, [payInfo.expYear])
    useEffect(() => {
        console.log(payInfo)
        validators.cvv()
    }, [payInfo.cvv])

    const setParameter = (name, value) => {
        setPayInfo({
            ...payInfo,
            [name]: value
        })
    };

    

    const validate = (fieldValues = payInfo) => {
        for (let prop in validators) {
            validators[prop]()
        }
        let ok = true
        for (let prop in errors) {
            if (errors[prop] !== "")
                ok = false
        }
        return ok
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        validate()
        console.log(payInfo)
        console.log("payment info submited")
    }

    return (
        <div>
            <MyBreadcrumbs
                activeCheckout={true}
                flightId={'KPNL145'}
            />
            <Form onSubmit={handleSubmit}>

                <BonusCheckout
                    bonuses={payInfo.bonuses}
                    setParameter={setParameter}
                />

                {<Paper className={classes.paper}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12}>
                            <Typography variant='h2' className={classes.breakText}>Card Informa&shy;tion</Typography>
                            <Typography className={classes.note}>
                                * All fields are required.
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={3} lg={2}>
                            <Typography >Card Number:</Typography>
                        </Grid>
                        <Grid item xs={12} md={9} lg={10}>
                            <TextField
                                error={errors.cardNumber !== "" ? true : false}
                                helperText={errors.cardNumber}
                                //required
                                value={payInfo.cardNumber}
                                onChange={(event) => { setParameter('cardNumber', event.target.value)}}
                                variant='outlined'
                                size="small"
                                className={classes.inputLong}
                                InputProps={{
                                    inputProps: {
                                        minlength: 16,
                                        maxlength: 19,
                                        //pattern: '^\\d{4} ?\\d{4} ?\\d{4} ?\\d{4}$',
                                    }
                                }}
                                placeholder='0000 0000 0000 0000'
                            />
                        </Grid>

                        <Grid item xs={12} md={3} lg={2}>
                            <Typography>Expiration Date:</Typography>
                        </Grid>
                        <Grid item xs={12} md={9} lg={10}>
                            <Box className={classes.box}>
                                <FormControl
                                    //required
                                    className={classes.inputShort}
                                    variant="outlined"
                                    size='small'
                                    error={errors.expMonth !== "" ? true : false}
                                >
                                    <Select
                                        
                                        helperText={errors.expMonth}
                                        value={payInfo.expMonth}
                                        onChange={(event) => { setParameter('expMonth', event.target.value) }}
                                    >
                                        {[...Array(12)].map((x, i) =>
                                            <MenuItem value={1 + i}>{1 + i}</MenuItem>
                                        )}
                                    </Select>
                                </FormControl>

                                <Typography className={classes.horizontalSpacing}>/</Typography>

                                <FormControl
                                    //required
                                    className={classes.inputShort}
                                    variant="outlined"
                                    size='small'
                                    error={errors.expYear !== "" ? true : false}
                                >
                                    <Select
                                        
                                        helperText={errors.expYear}
                                        value={payInfo.expYear}
                                        onChange={(event) => { setParameter('expYear', event.target.value)}}
                                    >
                                        {[...Array(10)].map((x, i) =>
                                            <MenuItem value={2021 + i}>{2021 + i}</MenuItem>
                                        )}
                                    </Select>
                                    <FormHelperText></FormHelperText>
                                </FormControl>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={3} lg={2}>
                            <Typography >CVV:</Typography>
                        </Grid>
                        <Grid item xs={12} md={9} lg={10}>
                            <TextField
                                error={errors.cvv !== "" ? true : false}
                                helperText={errors.cvv}
                                //required
                                value={payInfo.cvv}
                                onChange={(event) => { setParameter('cvv', event.target.value) }}
                                variant='outlined'
                                size="small"
                                className={classes.inputShort}
                                InputProps={{
                                    inputProps: {
                                        minlength: 3,
                                        maxlength: 3,
                                        //pattern: '^\\d{3}$',
                                    }
                                }}
                                placeholder='000'
                            />
                        </Grid>

                        <Grid item xs={12} md={3} lg={2}>
                            <Typography className={classes.boldText}>
                                Total:
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={9} lg={10}>
                            <Typography className={classes.boldText}>
                                {cost} $
                            </Typography>
                        </Grid>

                    </Grid>
                </Paper>}

                <Box textAlign='center' className={classes.spacing}>
                    <Button
                        color="primary"
                        size='large'
                        variant="contained"
                        type='submit'
                        startIcon={<PaymentIcon/>}
                        className={classes.button}
                    >
                        Pay
                    </Button>
                </Box>

            </Form>
        </div>
    );
}

export default Checkout;