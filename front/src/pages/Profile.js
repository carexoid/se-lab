import { Typography, Button, Box, TextField, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { logIn, logOut, setAuth } from '../actions/';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@mui/material';
import $ from 'jquery';
import { Form } from '../components/useForm';
import netlifyAuth from '../netlifyAuth'
import netlifyIdentity from 'netlify-identity-widget';
import GoTrue from 'gotrue-js';


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
        width: 200,
        margin: theme.spacing(1),
    }
}));

const emptyError = {
    email: '',
    phone: '',
    password: ''
}

const auth = new GoTrue({
    APIUrl: 'https://shlyahdomrii.tech/.netlify/identity',
    audience: '',
    setCookie: false,
});

function ProfileInfo() {
    const [user, setUser] = useState(netlifyIdentity.currentUser());

    const classes = useStyles();
    const [edit, setEdit] = useState(false)
    const [sure, setSure] = useState(false)
    const [change, setChange] = useState(false)
    const [newPassword, setNewPassword] = useState('')

    const defaultInfo = {
        email: `${user !== null ? user.email : ''}`,
        phone: typeof user.user_metadata!== 'undefined' ? user.user_metadata.phone : '',
        comment: typeof user.user_metadata !== 'undefined' ? user.user_metadata.comment : '',
    }

    const [info, setInfo] = useState(defaultInfo);
    const [errors, setErrors] = useState(emptyError)

    useEffect(() => {
        console.log('user on mount',user)
        /* $.ajax({
            type: 'GET',
            url: '/.netlify/identity/user',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + user.token.access_token
            },
            success: response => {
                console.log('response',response)
                setUser(response)
            }
        }) */
        //console.log(user)
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
                phone: (/^\+380 ?\d{2} ?\d{3} ?\d{2} ?\d{2}$/).test(info.phone)
                    || info.phone == '' || info.phone === null || typeof info.phone === 'undefined'
                    ? "" : "Number doesn't match Ukrainian format",
            })
        },
        password: () => {
            setErrors({
                ...errors,
                password: (/^.{6,}$/).test(newPassword) || newPassword === '' ? "" : "Password is invalid",
            })
        },
    }

//

    useEffect(() => {
        validators.email()
    }, [info.email])

    useEffect(() => {
        validators.phone()
    }, [info.phone])

    useEffect(() => {
        validators.password()
    }, [newPassword])

    useEffect(() => {
        console.log('change', change)
    }, [change])

    const validate = () => {
        validators.email()
        validators.phone()
        validators.password()

        if (errors.email == '' && errors.phone == '' && errors.password == '')
            return true
        return false
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validate()) {
            console.log('save was pressed, old user:', auth.currentUser())

            const newInfo = newPassword === '' ?
                {
                    email: info.email,
                    data: {
                        phone: info.phone,
                        comment: info.comment,
                    }
                } : {
                    email: info.email,
                    password: newPassword,
                    data: {
                        phone: info.phone,
                        comment: info.comment,
                    }
                }

            netlifyIdentity.currentUser().update(newInfo).then(user => {
                console.log('new user', user)
                setNewPassword('')
                setEdit(false)
               
                /* user.refresh(true).then(user =>
                    console.log('refreshed ',user)
                ) */
                              
            }).catch((error) => {
                console.log('Failed to update user: %o', error);
                throw error;
            });

            
        }
    }

    const handleDeleteClick = () => {
        setSure(true)
    }

    const handleDelete = () => {
        $.ajax({
            type: 'DELETE',
            url: '/api/chief/account'
        })
        /* $.ajax({
            type: 'DELETE',
            url: '/api/chief/account'
        }) */
       
        setAuth(false)
        netlifyAuth.signout(() => { console.log('deleting account') })
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
                                    id='profile-email-field'
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
                                    id='profile-phone-field'
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
                                    id='profile-comment-field'
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
                                            maxLength: 1000,
                                        }
                                    }}
                                />
                            }
                        </Grid>

                        {!edit ? null :
                            <Grid item xs={12} lg={1}>
                                <Typography className={classes.bold}>New Password:</Typography>
                            </Grid>
                        }
                        {!edit ? null :
                            <Grid item xs={12} lg={11}>
                                <TextField
                                    id='profile-password-field'
                                    error={errors.password !== "" ? true : false}
                                    helperText={errors.password}
                                    value={newPassword}
                                    onChange={(e) => { setNewPassword(e.target.value) }}
                                    variant='outlined'
                                    size="small"
                                    type='password'
                                    className={`${classes.horizontalSpacing} ${classes.inputLong}`}
                                    InputProps={{
                                        inputProps: {
                                            minLength: 6,
                                            maxLength: 32,
                                        }
                                    }}
                                />
                            </Grid>
                        }

                    </Grid>
                </Box>

                <Box className={classes.spacing}>
                    <Button
                        className={classes.button}
                        color="primary"
                        size='large'
                        variant="contained"
                        onClick={() => { setEdit(!edit); setInfo(defaultInfo); setNewPassword('') }}
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
                        >
                            Save
                        </Button>
                    }

                    <Button
                        className={classes.button}
                        color="secondary"
                        size='large'
                        variant="contained"
                        onClick={handleDeleteClick}
                    >
                        Delete
                    </Button>

                    <Dialog open={sure}>
                        <DialogContent>
                            <DialogContentText>Are you sure you want to delete this account?</DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button variant='text' onClick={() => setSure(false)}>No</Button>
                            <Button variant='text' onClick={handleDelete}>Yes</Button>
                        </DialogActions>
                    </Dialog>

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