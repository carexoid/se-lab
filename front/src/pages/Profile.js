import { Typography, Button, Box, TextField } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { logIn, logOut, setAuth } from '../actions/';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@mui/material';
import $ from 'jquery';
import { Form } from '../components/useForm';
import netlifyAuth from '../netlifyAuth'
import netlifyIdentity from 'netlify-identity-widget';
import Unauthorized from '../components/Unauthorized';

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

const emptyError = {
    email: '',
    phone: ''
}

function ProfileInfo() {
    const user = netlifyIdentity.currentUser();

    const classes = useStyles();
    const [edit, setEdit] = useState(false)

    const defaultInfo = {
        email: `${user !== null ? user.email : ''}`,
        phone: '333',
        comment: 'aaa'
    }

    const [info, setInfo] = useState(defaultInfo);
    const [errors, setErrors] = useState(emptyError)

    useEffect(() => {
        //fetch info
    }, [])

    const setInfoField = (name, value) => {
        setInfo({
            ...info,
            [name]: value
        })
    }

    const validators = {
        email: () => {
            setErrors({
                ...errors,
                email: info.email !== '' ? "" : "Email can't be empty",
            })
        },
        phone: () => {
            setErrors({
                ...errors,
                phone: (/^\+380 ?\d{2} ?\d{3} ?\d{2} ?\d{2}$/).test(info.phone) || info.phone == '' ? "" : "Number doesn't match Ukrainian format",
            })
        }
    }

    useEffect(() => {
        validators.email()
    }, [info.email])

    useEffect(() => {
        validators.phone()
    }, [info.phone])


    const validate = () => {
        validators.email()
        validators.phone()

        if (errors.email == '' && errors.phone == '')
            return true
        return false
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validate())
            setEdit(false)
    }

    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <Typography variant='h2'>Profile Information</Typography>

                <Box className={classes.spacing}>

                    <Grid container container spacing={2} /* alignItems={edit? 'center' : 'flex-start'} */ >
                        <Grid item xs={12} sm={1} lg={1}>
                            <Typography className={classes.bold}>Email<span className={classes.redText}>*</span>:</Typography>
                        </Grid>
                        <Grid item xs={12} sm={11} lg={11}>
                            {!edit ?
                                <Typography className={classes.horizontalSpacing}>{info.email}</Typography>
                                :
                                <TextField
                                    error={errors.email !== "" ? true : false}
                                    helperText={errors.email}
                                    value={info.email}
                                    onChange={(e) => { setInfoField('email', e.target.value) }}
                                    variant='outlined'
                                    size="small"
                                    type='email'
                                    className={`${classes.horizontalSpacing} ${classes.inputLong}`}
                                />
                            }
                        </Grid>

                        <Grid item xs={12} sm={1} lg={1}>
                            <Typography className={classes.bold}>Phone:</Typography>
                        </Grid>
                        <Grid item xs={12} sm={11} lg={11}>
                            {!edit ?
                                <Typography className={classes.horizontalSpacing}>{info.phone}</Typography>
                                :
                                <TextField
                                    error={errors.phone !== "" ? true : false}
                                    helperText={errors.phone}
                                    value={info.phone}
                                    onChange={(e) => { setInfoField('phone', e.target.value) }}
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
                                    {info.comment}
                                </Typography>
                                :
                                <TextField
                                    //error={errors.cardNumber !== "" ? true : false}
                                    //helperText={errors.cardNumber}
                                    value={info.comment}
                                    onChange={(e) => { setInfoField('comment', e.target.value) }}
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
                        onClick={() => { setEdit(!edit); setInfo(defaultInfo) }}
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
            </Form>
        </div>
    )
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
        setAuth: (value) => dispatch(setAuth(value)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileInfo);