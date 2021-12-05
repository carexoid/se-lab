import { Typography, Button, Box, TextField } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { logIn, logOut, authTrue, authFalse } from '../actions/';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@mui/material';
import $ from 'jquery';

const useStyles = makeStyles((theme) => ({
    spacing: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(4),
    },
    horizontalSpacing: {
        //marginRight: theme.spacing(1),
        marginLeft: theme.spacing(2),
    },
    note: {
        color: theme.palette.fadedtext.main,
        fontSize: 10,
    },
    paper: {
        verticalAlign: 'middle',
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(4),
        '& > *': {
            //margin: theme.spacing(6),
            width: '100%',
        },
        padding: theme.spacing(2),
        backgroundColor: theme.palette.papers.main,
    },
    inputLong: {
        width: 300,
    },
    inputHuge: {
        width: '60%',
        minWidth: 300,
    },
    redText: {
        color: theme.palette.secondary.main,
    },
    bold: {
        fontWeight: 700,
    },
    button: {
        width: 125,
        margin: theme.spacing(1),
    }
}));

function ProfileInfo({ id, email, auth, logIn, logOut, authFalse }) {
    const classes = useStyles();
    const [edit, setEdit] = useState(false)

    useEffect(() => {
        //fetch info
    }, [])

    return (
        <div>
            <Typography variant='h2'>Profile Information</Typography>

            <Box className={classes.spacing}>
                <Grid container container spacing={2} /* alignItems={edit? 'center' : 'flex-start'} */ >
                    <Grid item xs={12} sm={1} lg={1}>
                        <Typography className={classes.bold}>Email<span className={classes.redText}>*</span>:</Typography>
                    </Grid>
                    <Grid item xs={12} sm={11} lg={11}>
                        {!edit ?
                            <Typography className={classes.horizontalSpacing}>{email}</Typography>
                            :
                            <TextField
                                //error={errors.cardNumber !== "" ? true : false}
                                //helperText={errors.cardNumber}
                                //value={}
                                //onChange={(event) => { setParameter('cardNumber', event.target.value) }}
                                variant='outlined'
                                size="small"
                                className={`${classes.horizontalSpacing} ${classes.inputLong}`}
                            />
                        }
                    </Grid>

                    <Grid item xs={12} sm={1} lg={1}>
                        <Typography className={classes.bold}>Phone:</Typography>
                    </Grid>
                    <Grid item xs={12} sm={11} lg={11}>
                        {!edit ?
                            <Typography className={classes.horizontalSpacing}>+380969670651</Typography>
                            :
                            <TextField
                                //error={errors.cardNumber !== "" ? true : false}
                                //helperText={errors.cardNumber}
                                //value={}
                                //onChange={(event) => { setParameter('cardNumber', event.target.value) }}
                                variant='outlined'
                                size="small"
                                className={`${classes.horizontalSpacing} ${classes.inputLong}`}
                            />
                        }
                    </Grid>

                    <Grid item xs={12} lg={1}>
                        <Typography className={classes.bold}>Comment:</Typography>
                    </Grid>
                    <Grid item xs={12} lg={11}>
                        {!edit ?
                            <Typography className={`${classes.horizontalSpacing} ${classes.inputHuge}`}>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. D
                                onec facilisis volutpat semper. Mauris nec enim nibh. Sed t
                                empor odio mauris, vitae sodales ante sollicitudin id. Vivam
                                us interdum pharetra metus et lacinia. Cras semper et tellus ac ia
                                culis.
                            </Typography>
                            :
                            <TextField
                                //error={errors.cardNumber !== "" ? true : false}
                                //helperText={errors.cardNumber}
                                //value={}
                                //onChange={(event) => { setParameter('cardNumber', event.target.value) }}
                                variant='outlined'
                                size="small"
                                className={`${classes.horizontalSpacing} ${classes.inputHuge}`}
                                multiline
                                rows={4}
                                placeholder="I'm allergic to peanut butter"
                                InputProps={{
                                    inputProps: {
                                        maxlength: 1000,
                                    }
                                }}
                            />
                        }
                    </Grid>
                </Grid>
            </Box>

            <Box className={classes.spacing}>
                <Button
                    className={classes.button}
                    color="primary"
                    size='large'
                    variant="contained"
                    //type='sumbit'
                    onClick={() => setEdit(!edit)}
                >
                    {edit ? 'Cancel' : 'Edit'}
                </Button>

                {edit &&
                    <Button
                    className={classes.button}
                        color="primary"
                        size='large'
                        variant="contained"
                        type='sumbit'
                        //onClick={() => setEdit(!edit)}
                    >
                        Save
                    </Button>
                }

                <Button
                    className={classes.button}
                    color="secondary"
                    size='large'
                    variant="contained"
                    //onClick={() => setEdit(!edit)}
                >
                    Delete
                </Button>

            </Box>
        </div>
    );
}


//VERY IMPORTANT THINGS
const mapStateToProps = state => ({
    id: state.user.id,
    email: state.user.email,
    auth: state.auth
});

const mapDispatchToProps = (dispatch) => {
    return {
        logIn: (id, email) => dispatch(logIn(id, email)),
        logOut: () => dispatch(logOut()),
        authTrue: () => dispatch(authTrue()),
        authFalse: () => dispatch(authFalse()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileInfo);