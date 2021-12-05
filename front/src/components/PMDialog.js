import React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@material-ui/core/styles';
import { Box, DialogContent, Dialog, DialogTitle, DialogActions } from '@mui/material';
import { Button, Grid } from '@material-ui/core';
import { Link as RLink } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    box: {
        display: 'grid',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        width: 300
    },
}));

function PMDialog(props) {
    const classes = useStyles();
    const theme = useTheme();
    //const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    return (
        <Dialog
            //fullScreen={fullScreen}
            open={true}
        >

            <Box textAlign='center' className={classes.box}>
                <DialogContent>
                    <DialogTitle>
                        {"Choose Payment Method"}
                    </DialogTitle>
                </DialogContent>
                <DialogActions
                    disableSpacing
                >
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12}>
                            <Button
                                color="primary"
                                size='large'
                                variant="contained"
                                className={classes.button}
                                component={RLink} to={`/checkout${props.composeParameters(false)}`}
                            >
                                Pay Online
                            </Button>
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                color="primary"
                                size='large'
                                variant="contained"
                                className={classes.button}
                                component={RLink} to={`/checkout${props.composeParameters(true)}`}
                            >
                                Pay Online with Bonuses
                            </Button>
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                color="primary"
                                size='large'
                                variant="contained"
                                className={classes.button}
                            >
                                Pay Offline
                            </Button>
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                color="secondary"
                                size='large'
                                variant="contained"
                                className={classes.button}
                                onClick={() => {
                                    props.setActiveChoosePM(false)
                                }}
                            >
                                Cancel
                            </Button>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Box>
        </Dialog>
    );
}

export default PMDialog;