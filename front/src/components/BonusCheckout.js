import { Paper, TextField, Typography, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@mui/material';
import React from 'react';

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
}));

const bonuses = 234;
const coef = 1;

function BonusCheckout(props) {
    const classes = useStyles();

    return (
        <Paper className={classes.paper}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant='h2'>Bonuses Checkout</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography>You have {bonuses} avalaible Bonuses</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Box className={classes.box}>
                        <Typography className={classes.horizontalSpacing}>Specify the amount to use:</Typography>
                        <TextField
                            value={props.bonuses}
                            onChange={(event) => { props.setParameter('bonuses', event.target.value) }}
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
                                    max: bonuses
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
    );
}

export default BonusCheckout;