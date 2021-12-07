import LockIcon from '@material-ui/icons/Lock';
import { Typography } from '@material-ui/core';
import React, {useEffect} from 'react';
import netlifyAuth from '../netlifyAuth';
import { makeStyles, useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    box: {
        display: 'grid',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
    },
    spacing: {
        //marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
    },
}));

function Unauthorized() {
    const classes = useStyles();

    useEffect(() => {
        /* netlifyAuth.authenticate((user) => {
            console.log('user: ', user)
            setClickLogout(false);
        }) */
    },[])

    return (
        <div className={classes.box}>
            <LockIcon style={{ fill: '#3a404f', fontSize: 200, marginLeft: '29%', }} />
            <Typography variant='h2' className={classes.spacing}>Authorization required</Typography>
            <Typography className={classes.spacing}>You are not authorized to view this page. Please log in or sign up.</Typography>
        </div>
    );
}

export default Unauthorized;